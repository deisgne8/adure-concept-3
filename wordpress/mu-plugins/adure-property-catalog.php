<?php
/**
 * Plugin Name: ADURE Property Catalog
 * Description: Property inventory content types, ACF fields and public REST API.
 */

defined( 'ABSPATH' ) || exit;

const ADURE_PROPERTY_API_NAMESPACE = 'adure/v1';

function adure_property_labels( $singular, $plural ) {
	return array(
		'name'          => $plural,
		'singular_name' => $singular,
		'add_new_item'  => "Add New {$singular}",
		'edit_item'     => "Edit {$singular}",
		'new_item'      => "New {$singular}",
		'view_item'     => "View {$singular}",
		'search_items'  => "Search {$plural}",
		'not_found'     => "No {$plural} found",
		'menu_name'     => $plural,
	);
}

function adure_register_property_content() {
	register_post_type(
		'adure_building',
		array(
			'labels'       => adure_property_labels( 'Building', 'Buildings' ),
			'public'       => true,
			'show_in_rest' => false,
			'menu_icon'    => 'dashicons-building',
			'rewrite'      => array( 'slug' => 'buildings' ),
			'supports'     => array( 'title', 'editor', 'excerpt', 'thumbnail' ),
		)
	);

	register_post_type(
		'adure_unit',
		array(
			'labels'       => adure_property_labels( 'Unit', 'Units' ),
			'public'       => true,
			'show_in_rest' => false,
			'menu_icon'    => 'dashicons-admin-home',
			'rewrite'      => array( 'slug' => 'units' ),
			'supports'     => array( 'title', 'editor', 'excerpt', 'thumbnail' ),
		)
	);

	register_post_type(
		'adure_broker',
		array(
			'labels'       => adure_property_labels( 'Broker', 'Brokers' ),
			'public'       => false,
			'show_ui'      => true,
			'show_in_rest' => false,
			'menu_icon'    => 'dashicons-businessperson',
			'supports'     => array( 'title', 'editor', 'thumbnail' ),
		)
	);

	$taxonomies = array(
		'adure_sector'    => array( 'Sector', 'Sectors', false, array( 'adure_building', 'adure_unit' ) ),
		'adure_location'  => array( 'Location', 'Locations', true, array( 'adure_building', 'adure_unit' ) ),
		'adure_unit_type' => array( 'Unit Type', 'Unit Types', false, array( 'adure_unit' ) ),
		'adure_amenity'   => array( 'Amenity', 'Amenities', false, array( 'adure_building', 'adure_unit' ) ),
	);

	foreach ( $taxonomies as $taxonomy => $settings ) {
		$taxonomy_args = array(
			'labels'            => adure_property_labels( $settings[0], $settings[1] ),
			'public'            => true,
			'hierarchical'      => $settings[2],
			'show_in_rest'      => true,
			'show_admin_column' => true,
			'rewrite'           => array( 'slug' => str_replace( 'adure_', '', $taxonomy ) ),
		);
		if ( 'adure_amenity' === $taxonomy ) {
			$taxonomy_args['meta_box_cb'] = false;
		}
		register_taxonomy(
			$taxonomy,
			$settings[3],
			$taxonomy_args
		);
	}
}
add_action( 'init', 'adure_register_property_content' );

function adure_seed_property_terms() {
	foreach ( array( 'Residential' => 'residential', 'Retail' => 'retail' ) as $name => $slug ) {
		if ( ! term_exists( $slug, 'adure_sector' ) ) {
			wp_insert_term( $name, 'adure_sector', array( 'slug' => $slug ) );
		}
	}
}
add_action( 'init', 'adure_seed_property_terms', 20 );

function adure_acf_field( $key, $label, $name, $type, $options = array() ) {
	return array_merge(
		array(
			'key'   => $key,
			'label' => $label,
			'name'  => $name,
			'type'  => $type,
		),
		$options
	);
}

function adure_register_property_fields() {
	if ( ! function_exists( 'acf_add_local_field_group' ) ) {
		return;
	}

	acf_add_local_field_group(
		array(
			'key'        => 'group_adure_building_details',
			'title'      => 'Building Details',
			'show_in_rest' => 0,
			'fields'     => array(
				adure_acf_field( 'field_adure_building_summary', 'Summary', 'building_summary', 'textarea', array( 'rows' => 3, 'new_lines' => '' ) ),
				adure_acf_field( 'field_adure_building_address', 'Address', 'address', 'textarea', array( 'rows' => 2, 'new_lines' => '' ) ),
				adure_acf_field( 'field_adure_building_latitude', 'Latitude', 'latitude', 'number', array( 'step' => 'any' ) ),
				adure_acf_field( 'field_adure_building_longitude', 'Longitude', 'longitude', 'number', array( 'step' => 'any' ) ),
				adure_acf_field( 'field_adure_building_card_image', 'Card Thumbnail', 'card_image', 'image', array( 'return_format' => 'id', 'preview_size' => 'medium' ) ),
				adure_acf_field( 'field_adure_building_hero_image', 'Hero Image', 'hero_image', 'image', array( 'return_format' => 'id', 'preview_size' => 'medium' ) ),
				adure_acf_field( 'field_adure_building_gallery', 'Gallery', 'gallery', 'gallery', array( 'return_format' => 'id', 'preview_size' => 'medium' ) ),
				adure_acf_field( 'field_adure_building_amenities', 'Amenities', 'building_amenities', 'taxonomy', array( 'taxonomy' => 'adure_amenity', 'field_type' => 'checkbox', 'add_term' => 1, 'save_terms' => 1, 'load_terms' => 1, 'return_format' => 'id' ) ),
				adure_acf_field( 'field_adure_building_features', 'Building Features', 'building_features', 'textarea', array( 'instructions' => 'Enter one feature per line.', 'new_lines' => '' ) ),
				adure_acf_field( 'field_adure_building_seo_title', 'SEO Title', 'seo_title', 'text' ),
				adure_acf_field( 'field_adure_building_seo_description', 'SEO Description', 'seo_description', 'textarea', array( 'rows' => 3, 'new_lines' => '' ) ),
			),
			'location'   => array( array( array( 'param' => 'post_type', 'operator' => '==', 'value' => 'adure_building' ) ) ),
		)
	);

	acf_add_local_field_group(
		array(
			'key'          => 'group_adure_unit_details',
			'title'        => 'Unit Details',
			'show_in_rest' => 0,
			'fields'       => array(
				adure_acf_field( 'field_adure_unit_building', 'Building', 'building', 'post_object', array( 'post_type' => array( 'adure_building' ), 'return_format' => 'id', 'required' => 1 ) ),
				adure_acf_field( 'field_adure_unit_code', 'Unit Code', 'unit_code', 'text', array( 'required' => 1 ) ),
				adure_acf_field( 'field_adure_unit_transaction', 'Transaction', 'transaction', 'select', array( 'choices' => array( 'lease' => 'Lease', 'sale' => 'Sale', 'both' => 'Sale and Lease' ), 'default_value' => 'lease', 'return_format' => 'value' ) ),
				adure_acf_field( 'field_adure_unit_status', 'Internal Status', 'availability_status', 'select', array( 'choices' => array( 'available' => 'Available', 'occupied' => 'Occupied', 'unknown' => 'Unknown' ), 'default_value' => 'unknown', 'return_format' => 'value' ) ),
				adure_acf_field( 'field_adure_unit_show_publicly', 'Show Publicly', 'show_publicly', 'true_false', array( 'ui' => 1, 'default_value' => 0 ) ),
				adure_acf_field( 'field_adure_unit_floor', 'Floor', 'floor', 'text' ),
				adure_acf_field( 'field_adure_unit_subtype', 'Unit Subtype', 'unit_subtype', 'text' ),
				adure_acf_field( 'field_adure_unit_bedrooms', 'Bedrooms', 'bedrooms', 'number', array( 'min' => 0, 'step' => 1 ) ),
				adure_acf_field( 'field_adure_unit_bathrooms', 'Bathrooms', 'bathrooms', 'number', array( 'min' => 0, 'step' => 1 ) ),
				adure_acf_field( 'field_adure_unit_area', 'Area (sqm)', 'area_sqm', 'number', array( 'min' => 0, 'step' => 'any' ) ),
				adure_acf_field( 'field_adure_unit_common_area', 'Common Area (sqm)', 'common_area_sqm', 'number', array( 'min' => 0, 'step' => 'any' ) ),
				adure_acf_field( 'field_adure_unit_net_area', 'Net Area (sqm)', 'net_area_sqm', 'number', array( 'min' => 0, 'step' => 'any' ) ),
				adure_acf_field( 'field_adure_unit_source_area', 'Original Area Value', 'source_area', 'text', array( 'readonly' => 1 ) ),
				adure_acf_field( 'field_adure_unit_view', 'View', 'unit_view', 'text' ),
				adure_acf_field( 'field_adure_unit_balcony', 'Balcony', 'balcony', 'true_false', array( 'ui' => 1 ) ),
				adure_acf_field( 'field_adure_unit_maid_room', 'Maid Room', 'maid_room', 'true_false', array( 'ui' => 1 ) ),
				adure_acf_field( 'field_adure_unit_store_room', 'Store Room', 'store_room', 'true_false', array( 'ui' => 1 ) ),
				adure_acf_field( 'field_adure_unit_study_room', 'Study Room', 'study_room', 'true_false', array( 'ui' => 1 ) ),
				adure_acf_field( 'field_adure_unit_facilities', 'Facilities', 'facilities', 'textarea', array( 'rows' => 3, 'new_lines' => '' ) ),
				adure_acf_field( 'field_adure_unit_amenities', 'Amenities', 'unit_amenities', 'taxonomy', array( 'taxonomy' => 'adure_amenity', 'field_type' => 'checkbox', 'add_term' => 1, 'save_terms' => 1, 'load_terms' => 1, 'return_format' => 'id' ) ),
				adure_acf_field( 'field_adure_unit_annual_rent', 'Annual Rent', 'annual_rent', 'number', array( 'min' => 0, 'step' => 'any' ) ),
				adure_acf_field( 'field_adure_unit_sale_price', 'Sale Price', 'sale_price', 'number', array( 'min' => 0, 'step' => 'any' ) ),
				adure_acf_field( 'field_adure_unit_price_sqm', 'Price per sqm', 'price_per_sqm', 'number', array( 'min' => 0, 'step' => 'any' ) ),
				adure_acf_field( 'field_adure_unit_currency', 'Currency', 'currency', 'select', array( 'choices' => array( 'AED' => 'AED' ), 'default_value' => 'AED' ) ),
				adure_acf_field( 'field_adure_unit_card_image', 'Card Thumbnail', 'card_image', 'image', array( 'return_format' => 'id', 'preview_size' => 'medium' ) ),
				adure_acf_field( 'field_adure_unit_gallery', 'Gallery', 'gallery', 'gallery', array( 'return_format' => 'id', 'preview_size' => 'medium' ) ),
				adure_acf_field( 'field_adure_unit_floor_plan', 'Floor Plan', 'floor_plan', 'image', array( 'return_format' => 'id', 'preview_size' => 'medium' ) ),
				adure_acf_field( 'field_adure_unit_documents', 'Documents', 'documents', 'repeater', array(
					'button_label' => 'Add document',
					'sub_fields' => array(
						adure_acf_field( 'field_adure_unit_document_label', 'Label', 'label', 'text' ),
						adure_acf_field( 'field_adure_unit_document_file', 'File', 'file', 'file', array( 'return_format' => 'id' ) ),
					),
				) ),
				adure_acf_field( 'field_adure_unit_primary_broker', 'Primary Broker', 'primary_broker', 'post_object', array( 'post_type' => array( 'adure_broker' ), 'return_format' => 'id', 'allow_null' => 1 ) ),
				adure_acf_field( 'field_adure_unit_additional_brokers', 'Additional Brokers', 'additional_brokers', 'relationship', array( 'post_type' => array( 'adure_broker' ), 'return_format' => 'id' ) ),
				adure_acf_field( 'field_adure_unit_meter_number', 'E & W Meter Number', 'meter_number', 'text', array( 'instructions' => 'Internal only. Never returned by the public API.' ) ),
			),
			'location'     => array( array( array( 'param' => 'post_type', 'operator' => '==', 'value' => 'adure_unit' ) ) ),
		)
	);

	acf_add_local_field_group(
		array(
			'key'          => 'group_adure_broker_details',
			'title'        => 'Broker Details',
			'show_in_rest' => 0,
			'fields'       => array(
				adure_acf_field( 'field_adure_broker_position', 'Position', 'position', 'text' ),
				adure_acf_field( 'field_adure_broker_photo', 'Photo', 'photo', 'image', array( 'return_format' => 'id', 'preview_size' => 'medium' ) ),
				adure_acf_field( 'field_adure_broker_phone', 'Phone', 'phone', 'text' ),
				adure_acf_field( 'field_adure_broker_whatsapp', 'WhatsApp', 'whatsapp', 'text' ),
				adure_acf_field( 'field_adure_broker_email', 'Email', 'email', 'email' ),
				adure_acf_field( 'field_adure_broker_languages', 'Languages', 'languages', 'text' ),
				adure_acf_field( 'field_adure_broker_license', 'Licence Details', 'license_details', 'text' ),
				adure_acf_field( 'field_adure_broker_active', 'Active', 'active', 'true_false', array( 'ui' => 1, 'default_value' => 1 ) ),
			),
			'location'     => array( array( array( 'param' => 'post_type', 'operator' => '==', 'value' => 'adure_broker' ) ) ),
		)
	);
}
add_action( 'acf/init', 'adure_register_property_fields' );

function adure_property_value( $name, $post_id ) {
	return function_exists( 'get_field' ) ? get_field( $name, $post_id ) : get_post_meta( $post_id, $name, true );
}

function adure_property_title( $post_id ) {
	return html_entity_decode( get_the_title( $post_id ), ENT_QUOTES | ENT_HTML5, 'UTF-8' );
}

function adure_property_update_value( $name, $value, $post_id ) {
	if ( function_exists( 'update_field' ) ) {
		update_field( $name, $value, $post_id );
		return;
	}
	update_post_meta( $post_id, $name, $value );
}

function adure_property_image( $attachment_id ) {
	if ( is_array( $attachment_id ) ) {
		$attachment_id = $attachment_id['ID'] ?? $attachment_id['id'] ?? 0;
	}
	$attachment_id = (int) $attachment_id;
	if ( ! $attachment_id ) {
		return null;
	}
	return array(
		'id'        => $attachment_id,
		'alt'       => get_post_meta( $attachment_id, '_wp_attachment_image_alt', true ),
		'thumbnail' => wp_get_attachment_image_url( $attachment_id, 'thumbnail' ),
		'card'      => wp_get_attachment_image_url( $attachment_id, 'medium_large' ),
		'full'      => wp_get_attachment_image_url( $attachment_id, 'full' ),
	);
}

function adure_property_terms( $post_id, $taxonomy ) {
	$terms = wp_get_post_terms( $post_id, $taxonomy );
	if ( is_wp_error( $terms ) ) {
		return array();
	}
	return array_map(
		function ( $term ) {
			return array( 'id' => $term->term_id, 'name' => $term->name, 'slug' => $term->slug );
		},
		$terms
	);
}

function adure_property_first_image_id( $post_id, $field_names ) {
	foreach ( $field_names as $field_name ) {
		$image_id = adure_property_value( $field_name, $post_id );
		if ( is_array( $image_id ) ) {
			$image_id = $image_id['ID'] ?? $image_id['id'] ?? 0;
		}
		if ( $image_id ) {
			return $image_id;
		}
	}
	return get_post_thumbnail_id( $post_id );
}

function adure_property_terms_for_taxonomy( $taxonomy ) {
	$terms = get_terms(
		array(
			'taxonomy'   => $taxonomy,
			'hide_empty' => false,
		)
	);
	if ( is_wp_error( $terms ) ) {
		return array();
	}
	return array_map(
		function ( $term ) {
			return array( 'id' => $term->term_id, 'name' => $term->name, 'slug' => $term->slug );
		},
		$terms
	);
}

function adure_property_gallery( $post_id ) {
	$images = adure_property_value( 'gallery', $post_id );
	if ( ! is_array( $images ) ) {
		return array();
	}
	return array_values( array_filter( array_map( 'adure_property_image', $images ) ) );
}

function adure_format_broker( $broker_id ) {
	$broker_id = (int) $broker_id;
	if ( ! $broker_id || 'adure_broker' !== get_post_type( $broker_id ) || ! adure_property_value( 'active', $broker_id ) ) {
		return null;
	}
	return array(
		'id'        => $broker_id,
		'name'      => adure_property_title( $broker_id ),
		'position'  => adure_property_value( 'position', $broker_id ) ?: null,
		'photo'     => adure_property_image( adure_property_value( 'photo', $broker_id ) ),
		'phone'     => adure_property_value( 'phone', $broker_id ) ?: null,
		'whatsapp'  => adure_property_value( 'whatsapp', $broker_id ) ?: null,
		'email'     => adure_property_value( 'email', $broker_id ) ?: null,
		'languages' => array_values( array_filter( array_map( 'trim', explode( ',', (string) adure_property_value( 'languages', $broker_id ) ) ) ) ),
		'biography' => apply_filters( 'the_content', get_post_field( 'post_content', $broker_id ) ),
		'license'   => adure_property_value( 'license_details', $broker_id ) ?: null,
	);
}

function adure_format_building( $building_id, $include_gallery = true ) {
	$building_id = (int) $building_id;
	return array(
		'id'          => $building_id,
		'slug'        => get_post_field( 'post_name', $building_id ),
		'name'        => adure_property_title( $building_id ),
		'summary'     => adure_property_value( 'building_summary', $building_id ) ?: get_post_field( 'post_excerpt', $building_id ),
		'description' => apply_filters( 'the_content', get_post_field( 'post_content', $building_id ) ),
		'address'     => adure_property_value( 'address', $building_id ) ?: null,
		'latitude'    => adure_property_value( 'latitude', $building_id ) ?: null,
		'longitude'   => adure_property_value( 'longitude', $building_id ) ?: null,
		'sectors'     => adure_property_terms( $building_id, 'adure_sector' ),
		'locations'   => adure_property_terms( $building_id, 'adure_location' ),
		'amenities'   => adure_property_terms( $building_id, 'adure_amenity' ),
		'features'    => array_values( array_filter( array_map( 'trim', preg_split( '/\r?\n/', (string) adure_property_value( 'building_features', $building_id ) ) ) ) ),
		'cardImage'   => adure_property_image( adure_property_first_image_id( $building_id, array( 'card_image', 'card_thumbnail', 'building_card_image', 'building_card_thumbnail' ) ) ),
		'heroImage'   => adure_property_image( adure_property_value( 'hero_image', $building_id ) ),
		'gallery'     => $include_gallery ? adure_property_gallery( $building_id ) : array(),
		'seo'         => array(
			'title'       => adure_property_value( 'seo_title', $building_id ) ?: adure_property_title( $building_id ),
			'description' => adure_property_value( 'seo_description', $building_id ) ?: null,
		),
	);
}

function adure_format_unit( $unit_id, $include_details = false ) {
	$unit_id       = (int) $unit_id;
	$building_id   = (int) adure_property_value( 'building', $unit_id );
	$primary       = adure_format_broker( adure_property_value( 'primary_broker', $unit_id ) );
	$additional    = adure_property_value( 'additional_brokers', $unit_id );
	$additional    = is_array( $additional ) ? array_values( array_filter( array_map( 'adure_format_broker', $additional ) ) ) : array();
	$transaction   = adure_property_value( 'transaction', $unit_id ) ?: 'lease';
	$annual_rent   = adure_property_value( 'annual_rent', $unit_id );
	$sale_price    = adure_property_value( 'sale_price', $unit_id );
	$building      = $building_id ? adure_format_building( $building_id, false ) : null;

	$data = array(
		'id'           => $unit_id,
		'slug'         => get_post_field( 'post_name', $unit_id ),
		'title'        => adure_property_title( $unit_id ),
		'summary'      => get_post_field( 'post_excerpt', $unit_id ),
		'unitCode'     => (string) adure_property_value( 'unit_code', $unit_id ),
		'building'     => $building,
		'sectors'      => adure_property_terms( $unit_id, 'adure_sector' ),
		'locations'    => adure_property_terms( $unit_id, 'adure_location' ),
		'unitTypes'    => adure_property_terms( $unit_id, 'adure_unit_type' ),
		'amenities'    => adure_property_terms( $unit_id, 'adure_amenity' ),
		'transaction'  => $transaction,
		'status'       => adure_property_value( 'availability_status', $unit_id ),
		'floor'        => adure_property_value( 'floor', $unit_id ) ?: null,
		'subtype'      => adure_property_value( 'unit_subtype', $unit_id ) ?: null,
		'bedrooms'     => is_numeric( adure_property_value( 'bedrooms', $unit_id ) ) ? (int) adure_property_value( 'bedrooms', $unit_id ) : null,
		'bathrooms'    => is_numeric( adure_property_value( 'bathrooms', $unit_id ) ) ? (float) adure_property_value( 'bathrooms', $unit_id ) : null,
		'areaSqm'      => is_numeric( adure_property_value( 'area_sqm', $unit_id ) ) ? (float) adure_property_value( 'area_sqm', $unit_id ) : null,
		'currency'     => adure_property_value( 'currency', $unit_id ) ?: 'AED',
		'annualRent'   => is_numeric( $annual_rent ) ? (float) $annual_rent : null,
		'salePrice'    => is_numeric( $sale_price ) ? (float) $sale_price : null,
		'pricePerSqm'  => is_numeric( adure_property_value( 'price_per_sqm', $unit_id ) ) ? (float) adure_property_value( 'price_per_sqm', $unit_id ) : null,
		'cardImage'    => adure_property_image( adure_property_value( 'card_image', $unit_id ) ?: get_post_thumbnail_id( $unit_id ) ),
		'primaryBroker' => $primary,
		'additionalBrokers' => $additional,
	);

	if ( $include_details ) {
		$data['description']   = apply_filters( 'the_content', get_post_field( 'post_content', $unit_id ) );
		$data['view']          = adure_property_value( 'unit_view', $unit_id ) ?: null;
		$data['commonAreaSqm'] = is_numeric( adure_property_value( 'common_area_sqm', $unit_id ) ) ? (float) adure_property_value( 'common_area_sqm', $unit_id ) : null;
		$data['netAreaSqm']    = is_numeric( adure_property_value( 'net_area_sqm', $unit_id ) ) ? (float) adure_property_value( 'net_area_sqm', $unit_id ) : null;
		$data['features']      = array(
			'balcony'   => (bool) adure_property_value( 'balcony', $unit_id ),
			'maidRoom'  => (bool) adure_property_value( 'maid_room', $unit_id ),
			'storeRoom' => (bool) adure_property_value( 'store_room', $unit_id ),
			'studyRoom' => (bool) adure_property_value( 'study_room', $unit_id ),
		);
		$data['facilities']    = adure_property_value( 'facilities', $unit_id ) ?: null;
		$data['gallery']       = adure_property_gallery( $unit_id );
		$data['floorPlan']     = adure_property_image( adure_property_value( 'floor_plan', $unit_id ) );
		$data['documents']     = array();
		$documents             = adure_property_value( 'documents', $unit_id );
		if ( is_array( $documents ) ) {
			foreach ( $documents as $document ) {
				$file_id = isset( $document['file'] ) ? (int) $document['file'] : 0;
				if ( $file_id ) {
					$data['documents'][] = array( 'label' => $document['label'] ?: get_the_title( $file_id ), 'url' => wp_get_attachment_url( $file_id ) );
				}
			}
		}
	}

	return $data;
}

function adure_public_unit_meta_query() {
	return array(
		'relation' => 'AND',
		array( 'key' => 'show_publicly', 'value' => '1' ),
		array( 'key' => 'availability_status', 'value' => 'available' ),
	);
}

function adure_property_facets( $sector = '' ) {
	$args = array(
			'post_type'      => 'adure_unit',
			'post_status'    => 'publish',
			'posts_per_page' => -1,
			'fields'         => 'ids',
			'meta_query'     => adure_public_unit_meta_query(),
		);
	if ( $sector ) {
		$args['tax_query'] = array( array( 'taxonomy' => 'adure_sector', 'field' => 'slug', 'terms' => sanitize_title( $sector ) ) );
	}
	$query = new WP_Query( $args );
	$facets = array( 'sectors' => array(), 'locations' => array(), 'unitTypes' => array(), 'buildings' => array() );
	foreach ( $query->posts as $unit_id ) {
		foreach ( array( 'sectors' => 'adure_sector', 'locations' => 'adure_location', 'unitTypes' => 'adure_unit_type' ) as $key => $taxonomy ) {
			foreach ( adure_property_terms( $unit_id, $taxonomy ) as $term ) {
				$facets[ $key ][ $term['slug'] ] = $term;
			}
		}
		$building_id = (int) adure_property_value( 'building', $unit_id );
		if ( $building_id ) {
			$slug = get_post_field( 'post_name', $building_id );
			$facets['buildings'][ $slug ] = array( 'id' => $building_id, 'name' => adure_property_title( $building_id ), 'slug' => $slug );
		}
	}
	return array_map( 'array_values', $facets );
}

function adure_rest_properties( WP_REST_Request $request ) {
	$page     = max( 1, (int) $request->get_param( 'page' ) );
	$per_page = min( 48, max( 1, (int) ( $request->get_param( 'per_page' ) ?: 12 ) ) );
	$meta     = adure_public_unit_meta_query();
	$tax      = array();

	foreach ( array( 'sector' => 'adure_sector', 'location' => 'adure_location', 'unit_type' => 'adure_unit_type' ) as $parameter => $taxonomy ) {
		if ( $request->get_param( $parameter ) ) {
			$tax[] = array( 'taxonomy' => $taxonomy, 'field' => 'slug', 'terms' => sanitize_title( $request->get_param( $parameter ) ) );
		}
	}

	if ( $request->get_param( 'building' ) ) {
		$building = get_page_by_path( sanitize_title( $request->get_param( 'building' ) ), OBJECT, 'adure_building' );
		$meta[] = array( 'key' => 'building', 'value' => $building ? $building->ID : 0 );
	}
	if ( '' !== (string) $request->get_param( 'bedrooms' ) && null !== $request->get_param( 'bedrooms' ) ) {
		$meta[] = array( 'key' => 'bedrooms', 'value' => (int) $request->get_param( 'bedrooms' ), 'type' => 'NUMERIC' );
	}
	if ( $request->get_param( 'transaction' ) ) {
		$meta[] = array(
			'relation' => 'OR',
			array( 'key' => 'transaction', 'value' => sanitize_key( $request->get_param( 'transaction' ) ) ),
			array( 'key' => 'transaction', 'value' => 'both' ),
		);
	}
	if ( $request->get_param( 'min_area' ) ) {
		$meta[] = array( 'key' => 'area_sqm', 'value' => (float) $request->get_param( 'min_area' ), 'compare' => '>=', 'type' => 'NUMERIC' );
	}
	if ( $request->get_param( 'max_area' ) ) {
		$meta[] = array( 'key' => 'area_sqm', 'value' => (float) $request->get_param( 'max_area' ), 'compare' => '<=', 'type' => 'NUMERIC' );
	}

	$transaction = sanitize_key( $request->get_param( 'transaction' ) ?: 'lease' );
	$price_key   = 'sale' === $transaction ? 'sale_price' : 'annual_rent';
	if ( $request->get_param( 'min_price' ) ) {
		$meta[] = array( 'key' => $price_key, 'value' => (float) $request->get_param( 'min_price' ), 'compare' => '>=', 'type' => 'NUMERIC' );
	}
	if ( $request->get_param( 'max_price' ) ) {
		$meta[] = array( 'key' => $price_key, 'value' => (float) $request->get_param( 'max_price' ), 'compare' => '<=', 'type' => 'NUMERIC' );
	}

	$query = new WP_Query(
		array(
			'post_type'      => 'adure_unit',
			'post_status'    => 'publish',
			'posts_per_page' => $per_page,
			'paged'          => $page,
			'meta_query'     => $meta,
			'tax_query'      => $tax,
			'orderby'        => 'date',
			'order'          => 'DESC',
		)
	);

	return rest_ensure_response(
		array(
			'items'      => array_map( function ( $post ) { return adure_format_unit( $post->ID ); }, $query->posts ),
			'pagination' => array( 'page' => $page, 'perPage' => $per_page, 'total' => (int) $query->found_posts, 'totalPages' => (int) $query->max_num_pages ),
			'facets'     => adure_property_facets( $request->get_param( 'sector' ) ),
			'facetsBySector' => array(
				'residential' => adure_property_facets( 'residential' ),
				'retail'      => adure_property_facets( 'retail' ),
			),
		)
	);
}

function adure_rest_buildings( WP_REST_Request $request ) {
	$page     = max( 1, (int) $request->get_param( 'page' ) );
	$per_page = min( 50, max( 1, (int) ( $request->get_param( 'per_page' ) ?: 20 ) ) );
	$tax      = array();

	if ( $request->get_param( 'location' ) ) {
		$tax[] = array(
			'taxonomy' => 'adure_location',
			'field'    => 'slug',
			'terms'    => sanitize_title( $request->get_param( 'location' ) ),
		);
	}

	$query = new WP_Query(
		array(
			'post_type'      => 'adure_building',
			'post_status'    => 'publish',
			'posts_per_page' => $per_page,
			'paged'          => $page,
			'tax_query'      => $tax,
			'orderby'        => 'title',
			'order'          => 'ASC',
		)
	);

	return rest_ensure_response(
		array(
			'items'      => array_map( function ( $post ) { return adure_format_building( $post->ID, false ); }, $query->posts ),
			'pagination' => array(
				'page'       => $page,
				'perPage'    => $per_page,
				'total'      => (int) $query->found_posts,
				'totalPages' => (int) $query->max_num_pages,
			),
			'facets'     => array(
				'locations' => adure_property_terms_for_taxonomy( 'adure_location' ),
				'sectors'   => adure_property_terms_for_taxonomy( 'adure_sector' ),
			),
		)
	);
}

function adure_rest_building( WP_REST_Request $request ) {
	$building = get_page_by_path( sanitize_title( $request['slug'] ), OBJECT, 'adure_building' );
	if ( ! $building || 'publish' !== $building->post_status ) {
		return new WP_Error( 'adure_building_not_found', 'Building not found.', array( 'status' => 404 ) );
	}
	$query = new WP_Query(
		array(
			'post_type'      => 'adure_unit',
			'post_status'    => 'publish',
			'posts_per_page' => -1,
			'meta_query'     => array_merge( adure_public_unit_meta_query(), array( array( 'key' => 'building', 'value' => $building->ID ) ) ),
		)
	);
	$data          = adure_format_building( $building->ID );
	$data['units'] = array_map( function ( $post ) { return adure_format_unit( $post->ID ); }, $query->posts );
	return rest_ensure_response( $data );
}

function adure_rest_unit( WP_REST_Request $request ) {
	$unit = get_page_by_path( sanitize_title( $request['slug'] ), OBJECT, 'adure_unit' );
	if ( ! $unit || 'publish' !== $unit->post_status || ! adure_property_value( 'show_publicly', $unit->ID ) || 'available' !== adure_property_value( 'availability_status', $unit->ID ) ) {
		return new WP_Error( 'adure_unit_not_found', 'Unit not found.', array( 'status' => 404 ) );
	}
	return rest_ensure_response( adure_format_unit( $unit->ID, true ) );
}

function adure_register_property_rest_routes() {
	register_rest_route( ADURE_PROPERTY_API_NAMESPACE, '/properties', array( 'methods' => WP_REST_Server::READABLE, 'callback' => 'adure_rest_properties', 'permission_callback' => '__return_true' ) );
	register_rest_route( ADURE_PROPERTY_API_NAMESPACE, '/buildings', array( 'methods' => WP_REST_Server::READABLE, 'callback' => 'adure_rest_buildings', 'permission_callback' => '__return_true' ) );
	register_rest_route( ADURE_PROPERTY_API_NAMESPACE, '/buildings/(?P<slug>[a-zA-Z0-9-]+)', array( 'methods' => WP_REST_Server::READABLE, 'callback' => 'adure_rest_building', 'permission_callback' => '__return_true' ) );
	register_rest_route( ADURE_PROPERTY_API_NAMESPACE, '/units/(?P<slug>[a-zA-Z0-9-]+)', array( 'methods' => WP_REST_Server::READABLE, 'callback' => 'adure_rest_unit', 'permission_callback' => '__return_true' ) );
}
add_action( 'rest_api_init', 'adure_register_property_rest_routes' );

function adure_property_admin_columns( $columns ) {
	return array_slice( $columns, 0, 2, true ) + array(
		'adure_building'    => 'Building',
		'adure_sector'      => 'Sector',
		'adure_availability' => 'Availability',
		'adure_transaction' => 'Transaction',
		'adure_broker'      => 'Primary Broker',
	) + array_slice( $columns, 2, null, true );
}
add_filter( 'manage_adure_unit_posts_columns', 'adure_property_admin_columns' );

function adure_property_admin_column( $column, $post_id ) {
	if ( 'adure_building' === $column ) {
		$building_id = (int) adure_property_value( 'building', $post_id );
		echo $building_id ? esc_html( get_the_title( $building_id ) ) : '—';
	} elseif ( 'adure_sector' === $column ) {
		echo esc_html( implode( ', ', wp_get_post_terms( $post_id, 'adure_sector', array( 'fields' => 'names' ) ) ) );
	} elseif ( 'adure_availability' === $column ) {
		echo esc_html( ucfirst( adure_property_value( 'availability_status', $post_id ) ?: 'unknown' ) );
	} elseif ( 'adure_transaction' === $column ) {
		echo esc_html( ucfirst( adure_property_value( 'transaction', $post_id ) ?: 'lease' ) );
	} elseif ( 'adure_broker' === $column ) {
		$broker_id = (int) adure_property_value( 'primary_broker', $post_id );
		echo $broker_id ? esc_html( get_the_title( $broker_id ) ) : '—';
	}
}
add_action( 'manage_adure_unit_posts_custom_column', 'adure_property_admin_column', 10, 2 );

function adure_property_admin_filters( $post_type ) {
	if ( 'adure_unit' !== $post_type ) {
		return;
	}
	foreach ( array( 'adure_sector' => 'All sectors', 'adure_unit_type' => 'All unit types' ) as $taxonomy => $label ) {
		wp_dropdown_categories( array( 'show_option_all' => $label, 'taxonomy' => $taxonomy, 'name' => $taxonomy, 'orderby' => 'name', 'selected' => isset( $_GET[ $taxonomy ] ) ? (int) $_GET[ $taxonomy ] : 0, 'hierarchical' => true, 'hide_empty' => false ) );
	}
}
add_action( 'restrict_manage_posts', 'adure_property_admin_filters' );

function adure_property_filter_query( $query ) {
	global $pagenow;
	if ( ! is_admin() || 'edit.php' !== $pagenow || 'adure_unit' !== $query->get( 'post_type' ) ) {
		return;
	}
	$tax_query = array();
	foreach ( array( 'adure_sector', 'adure_unit_type' ) as $taxonomy ) {
		if ( ! empty( $_GET[ $taxonomy ] ) ) {
			$tax_query[] = array( 'taxonomy' => $taxonomy, 'field' => 'term_id', 'terms' => (int) $_GET[ $taxonomy ] );
		}
	}
	if ( $tax_query ) {
		$query->set( 'tax_query', $tax_query );
	}
}
add_action( 'pre_get_posts', 'adure_property_filter_query' );
