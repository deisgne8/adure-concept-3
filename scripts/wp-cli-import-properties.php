<?php
/**
 * Run with wp eval-file after setting ADURE_IMPORT_FILE, ADURE_IMPORT_TYPE,
 * ADURE_IMPORT_OFFSET and ADURE_IMPORT_LIMIT.
 */

defined( 'ABSPATH' ) || exit;

$file   = getenv( 'ADURE_IMPORT_FILE' );
$type   = getenv( 'ADURE_IMPORT_TYPE' );
$offset = max( 0, (int) getenv( 'ADURE_IMPORT_OFFSET' ) );
$limit  = max( 1, (int) getenv( 'ADURE_IMPORT_LIMIT' ) );

if ( ! $file || ! is_readable( $file ) ) {
	WP_CLI::error( 'The import payload is not readable.' );
}

$payload = json_decode( file_get_contents( $file ), true );
if ( ! is_array( $payload ) ) {
	WP_CLI::error( 'The import payload is not valid JSON.' );
}

if ( 'finalize' === $type ) {
	update_option( 'adure_property_import_complete', gmdate( 'c' ), false );
	WP_CLI::success( 'Property import locked.' );
	return;
}

$key      = 'building' === $type ? 'buildings' : 'units';
$callback = 'building' === $type ? 'adure_import_building' : 'adure_import_unit';
$records  = array_slice( $payload[ $key ] ?? array(), $offset, $limit );
$errors   = array();

foreach ( $records as $record ) {
	$result = call_user_func( $callback, $record );
	if ( is_wp_error( $result ) ) {
		$errors[] = array(
			'key'     => $record['key'] ?? '',
			'message' => $result->get_error_message(),
		);
	}
}

if ( $errors ) {
	WP_CLI::error( wp_json_encode( $errors ) );
}

WP_CLI::success( sprintf( '%s:%d:%d', $type, $offset, count( $records ) ) );
