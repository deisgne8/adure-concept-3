<?php
/**
 * Assign normalized amenities without changing any other unit fields.
 */

defined( 'ABSPATH' ) || exit;

$file   = getenv( 'ADURE_IMPORT_FILE' );
$offset = max( 0, (int) getenv( 'ADURE_IMPORT_OFFSET' ) );
$limit  = max( 1, (int) getenv( 'ADURE_IMPORT_LIMIT' ) );

if ( ! $file || ! is_readable( $file ) ) {
	WP_CLI::error( 'The import payload is not readable.' );
}

$payload = json_decode( file_get_contents( $file ), true );
if ( ! is_array( $payload ) ) {
	WP_CLI::error( 'The import payload is not valid JSON.' );
}

$records = array_slice( $payload['units'] ?? array(), $offset, $limit );
$errors  = array();

foreach ( $records as $record ) {
	$post_id = adure_import_find_post( 'adure_unit', $record['key'] ?? '' );
	if ( ! $post_id ) {
		$building_id = adure_import_find_post( 'adure_building', $record['buildingKey'] ?? '' );
		$candidates  = get_posts(
			array(
				'post_type'      => 'adure_unit',
				'post_status'    => 'any',
				'posts_per_page' => -1,
				'fields'         => 'ids',
				'meta_key'       => 'building',
				'meta_value'     => $building_id,
			)
		);
		$wanted = strtolower( preg_replace( '/\s+/', ' ', trim( $record['unitCode'] ?? '' ) ) );
		foreach ( $candidates as $candidate_id ) {
			$existing_code = strtolower( preg_replace( '/\s+/', ' ', trim( (string) adure_property_value( 'unit_code', $candidate_id ) ) ) );
			if ( $wanted && $wanted === $existing_code ) {
				$post_id = (int) $candidate_id;
				update_post_meta( $post_id, '_adure_import_key', $record['key'] );
				break;
			}
		}
	}
	if ( ! $post_id ) {
		$errors[] = array( 'key' => $record['key'] ?? '', 'message' => 'Unit not found.' );
		continue;
	}
	$existing = wp_get_post_terms( $post_id, 'adure_amenity', array( 'fields' => 'names' ) );
	$combined = array_values( array_unique( array_merge( is_wp_error( $existing ) ? array() : $existing, $record['amenities'] ?? array() ) ) );
	adure_import_set_terms( $post_id, 'adure_amenity', $combined );
}

if ( $errors ) {
	WP_CLI::error( wp_json_encode( $errors ) );
}

WP_CLI::success( sprintf( 'amenities:%d:%d', $offset, count( $records ) ) );
