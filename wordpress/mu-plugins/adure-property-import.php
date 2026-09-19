<?php
/**
 * Plugin Name: ADURE Property Import
 * Description: Authenticated one-time property inventory import endpoint.
 */

defined( 'ABSPATH' ) || exit;

function adure_import_permission() {
	return current_user_can( 'manage_options' );
}

function adure_import_find_post( $post_type, $import_key ) {
	$posts = get_posts(
		array(
			'post_type'      => $post_type,
			'post_status'    => 'any',
			'posts_per_page' => 1,
			'fields'         => 'ids',
			'meta_key'       => '_adure_import_key',
			'meta_value'     => $import_key,
		)
	);
	return $posts ? (int) $posts[0] : 0;
}

function adure_import_set_terms( $post_id, $taxonomy, $names ) {
	$term_ids = array();
	foreach ( array_filter( array_map( 'trim', (array) $names ) ) as $name ) {
		$term = term_exists( sanitize_title( $name ), $taxonomy );
		if ( ! $term ) {
			$term = wp_insert_term( $name, $taxonomy, array( 'slug' => sanitize_title( $name ) ) );
		}
		if ( ! is_wp_error( $term ) ) {
			$term_ids[] = (int) ( is_array( $term ) ? $term['term_id'] : $term );
		}
	}
	wp_set_object_terms( $post_id, $term_ids, $taxonomy, false );
}

function adure_import_set_location( $post_id, $path ) {
	$parent   = 0;
	$term_ids = array();
	foreach ( array_filter( array_map( 'trim', (array) $path ) ) as $name ) {
		$existing = get_terms(
			array(
				'taxonomy'   => 'adure_location',
				'hide_empty' => false,
				'name'       => $name,
				'parent'     => $parent,
				'number'     => 1,
			)
		);
		if ( $existing && ! is_wp_error( $existing ) ) {
			$term_id = (int) $existing[0]->term_id;
		} else {
			$created = wp_insert_term( $name, 'adure_location', array( 'parent' => $parent ) );
			if ( is_wp_error( $created ) ) {
				continue;
			}
			$term_id = (int) $created['term_id'];
		}
		$term_ids[] = $term_id;
		$parent     = $term_id;
	}
	wp_set_object_terms( $post_id, $term_ids, 'adure_location', false );
}

function adure_import_building( $record ) {
	$key = sanitize_text_field( $record['key'] ?? '' );
	if ( ! $key || empty( $record['name'] ) ) {
		return new WP_Error( 'invalid_building', 'Building key and name are required.' );
	}

	$post_id = adure_import_find_post( 'adure_building', $key );
	$args    = array(
		'ID'           => $post_id,
		'post_type'    => 'adure_building',
		'post_status'  => 'publish',
		'post_title'   => sanitize_text_field( $record['name'] ),
		'post_name'    => sanitize_title( $record['slug'] ?? $record['name'] ),
		'post_excerpt' => sanitize_textarea_field( $record['summary'] ?? '' ),
	);
	$post_id = $post_id ? wp_update_post( $args, true ) : wp_insert_post( $args, true );
	if ( is_wp_error( $post_id ) ) {
		return $post_id;
	}

	update_post_meta( $post_id, '_adure_import_key', $key );
	adure_import_set_terms( $post_id, 'adure_sector', $record['sectors'] ?? array() );
	adure_import_set_location( $post_id, $record['location'] ?? array() );
	return (int) $post_id;
}

function adure_import_boolean( $value ) {
	if ( is_bool( $value ) ) {
		return $value;
	}
	return in_array( strtolower( trim( (string) $value ) ), array( '1', 'yes', 'y', 'true', 'available' ), true );
}

function adure_import_unit( $record ) {
	$key          = sanitize_text_field( $record['key'] ?? '' );
	$building_key = sanitize_text_field( $record['buildingKey'] ?? '' );
	$unit_code    = sanitize_text_field( $record['unitCode'] ?? '' );
	$building_id  = adure_import_find_post( 'adure_building', $building_key );
	if ( ! $key || ! $building_id || ! $unit_code ) {
		return new WP_Error( 'invalid_unit', 'Unit key, code and a valid building are required.' );
	}

	$status      = in_array( $record['status'] ?? '', array( 'available', 'occupied', 'unknown' ), true ) ? $record['status'] : 'unknown';
	$post_status = 'available' === $status ? 'publish' : ( 'occupied' === $status ? 'private' : 'draft' );
	$post_id     = adure_import_find_post( 'adure_unit', $key );
	$title       = sanitize_text_field( ( $record['buildingName'] ?? get_the_title( $building_id ) ) . ' - Unit ' . $unit_code );
	$args        = array(
		'ID'          => $post_id,
		'post_type'   => 'adure_unit',
		'post_status' => $post_status,
		'post_title'  => $title,
		'post_name'   => sanitize_title( ( $record['buildingSlug'] ?? $building_key ) . '-' . $unit_code ),
	);
	$post_id = $post_id ? wp_update_post( $args, true ) : wp_insert_post( $args, true );
	if ( is_wp_error( $post_id ) ) {
		return $post_id;
	}

	update_post_meta( $post_id, '_adure_import_key', $key );
	$fields = array(
		'building'           => $building_id,
		'unit_code'          => $unit_code,
		'transaction'        => sanitize_key( $record['transaction'] ?? 'lease' ),
		'availability_status' => $status,
		'show_publicly'      => 'available' === $status ? 1 : 0,
		'floor'              => sanitize_text_field( $record['floor'] ?? '' ),
		'unit_subtype'       => sanitize_text_field( $record['subtype'] ?? '' ),
		'bedrooms'           => isset( $record['bedrooms'] ) ? $record['bedrooms'] : '',
		'bathrooms'          => isset( $record['bathrooms'] ) ? $record['bathrooms'] : '',
		'area_sqm'           => isset( $record['areaSqm'] ) ? $record['areaSqm'] : '',
		'common_area_sqm'    => isset( $record['commonAreaSqm'] ) ? $record['commonAreaSqm'] : '',
		'net_area_sqm'       => isset( $record['netAreaSqm'] ) ? $record['netAreaSqm'] : '',
		'source_area'        => sanitize_text_field( $record['sourceArea'] ?? '' ),
		'unit_view'          => sanitize_text_field( $record['view'] ?? '' ),
		'balcony'            => adure_import_boolean( $record['balcony'] ?? false ),
		'maid_room'          => adure_import_boolean( $record['maidRoom'] ?? false ),
		'store_room'         => adure_import_boolean( $record['storeRoom'] ?? false ),
		'study_room'         => adure_import_boolean( $record['studyRoom'] ?? false ),
		'facilities'         => sanitize_textarea_field( $record['facilities'] ?? '' ),
		'annual_rent'        => isset( $record['annualRent'] ) ? $record['annualRent'] : '',
		'price_per_sqm'      => isset( $record['pricePerSqm'] ) ? $record['pricePerSqm'] : '',
		'currency'           => 'AED',
		'meter_number'       => sanitize_text_field( $record['meterNumber'] ?? '' ),
	);
	foreach ( $fields as $name => $value ) {
		adure_property_update_value( $name, $value, $post_id );
	}

	adure_import_set_terms( $post_id, 'adure_sector', array( $record['sector'] ?? 'Residential' ) );
	adure_import_set_terms( $post_id, 'adure_unit_type', array_filter( array( $record['unitType'] ?? '' ) ) );
	adure_import_set_terms( $post_id, 'adure_amenity', $record['amenities'] ?? array() );
	adure_import_set_location( $post_id, $record['location'] ?? array() );
	return (int) $post_id;
}

function adure_rest_import_properties( WP_REST_Request $request ) {
	if ( get_option( 'adure_property_import_complete' ) && ! $request->get_param( 'force' ) ) {
		return new WP_Error( 'adure_import_complete', 'The one-time property import is locked.', array( 'status' => 409 ) );
	}

	$created = array( 'buildings' => 0, 'units' => 0 );
	$errors  = array();
	foreach ( (array) $request->get_param( 'buildings' ) as $record ) {
		$result = adure_import_building( $record );
		if ( is_wp_error( $result ) ) {
			$errors[] = array( 'type' => 'building', 'key' => $record['key'] ?? '', 'message' => $result->get_error_message() );
		} else {
			++$created['buildings'];
		}
	}
	foreach ( (array) $request->get_param( 'units' ) as $record ) {
		$result = adure_import_unit( $record );
		if ( is_wp_error( $result ) ) {
			$errors[] = array( 'type' => 'unit', 'key' => $record['key'] ?? '', 'message' => $result->get_error_message() );
		} else {
			++$created['units'];
		}
	}
	if ( $request->get_param( 'finalize' ) && ! $errors ) {
		update_option( 'adure_property_import_complete', gmdate( 'c' ), false );
	}
	return rest_ensure_response( array( 'processed' => $created, 'errors' => $errors, 'locked' => (bool) get_option( 'adure_property_import_complete' ) ) );
}

function adure_register_property_import_route() {
	register_rest_route(
		ADURE_PROPERTY_API_NAMESPACE,
		'/property-import',
		array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => 'adure_rest_import_properties',
			'permission_callback' => 'adure_import_permission',
		)
	);
}
add_action( 'rest_api_init', 'adure_register_property_import_route' );
