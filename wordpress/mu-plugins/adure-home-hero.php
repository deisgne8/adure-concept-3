<?php
/**
 * Plugin Name: ADURE Home Components
 * Description: Registers REST-visible Flexible Content components for the Home page.
 */

defined( 'ABSPATH' ) || exit;

function adure_home_page_id() {
	$page = get_page_by_path( 'home', OBJECT, 'page' );

	if ( $page instanceof WP_Post ) {
		return (int) $page->ID;
	}

	$page_id = wp_insert_post(
		array(
			'post_title'  => 'Home',
			'post_name'   => 'home',
			'post_status' => 'publish',
			'post_type'   => 'page',
		)
	);

	return is_wp_error( $page_id ) ? 0 : (int) $page_id;
}

function adure_ensure_home_page() {
	adure_home_page_id();
}
add_action( 'init', 'adure_ensure_home_page', 1 );

function adure_home_hero_video_attachment( $page_id ) {
	$uploads = wp_upload_dir();
	$path    = trailingslashit( $uploads['basedir'] ) . 'adure/hidd-al-saadiyat-hero.mp4';
	$url     = trailingslashit( $uploads['baseurl'] ) . 'adure/hidd-al-saadiyat-hero.mp4';

	if ( ! file_exists( $path ) ) {
		return 0;
	}

	$attachment_id = attachment_url_to_postid( $url );

	if ( $attachment_id ) {
		return (int) $attachment_id;
	}

	return (int) wp_insert_attachment(
		array(
			'post_mime_type' => 'video/mp4',
			'post_title'     => 'Hidd Al Saadiyat Hero',
			'post_status'    => 'inherit',
			'guid'           => $url,
		),
		$path,
		$page_id
	);
}

function adure_register_home_components() {
	if ( ! function_exists( 'acf_add_local_field_group' ) ) {
		return;
	}

	$page_id = adure_home_page_id();

	if ( ! $page_id ) {
		return;
	}

	acf_add_local_field_group(
		array(
			'key'      => 'group_adure_home_components',
			'title'    => 'Home Components',
			'fields'   => array(
				array(
					'key'          => 'field_adure_home_components',
					'label'        => 'Page Components',
					'name'         => 'home_components',
					'type'         => 'flexible_content',
					'button_label' => 'Add component',
					'layouts'      => array(
						array(
							'key'        => 'layout_adure_hero',
							'name'       => 'hero',
							'label'      => 'Hero',
							'display'    => 'block',
							'sub_fields' => array(
								array(
									'key'          => 'field_adure_hero_heading',
									'label'        => 'Heading',
									'name'         => 'hero_heading',
									'type'         => 'textarea',
									'instructions' => 'Use a new line wherever the heading should break.',
									'rows'         => 3,
									'new_lines'    => '',
								),
								array(
									'key'       => 'field_adure_hero_description',
									'label'     => 'Description',
									'name'      => 'hero_description',
									'type'      => 'textarea',
									'rows'      => 3,
									'new_lines' => '',
								),
								array(
									'key'           => 'field_adure_hero_video_source',
									'label'         => 'Video Source',
									'name'          => 'hero_video_source',
									'type'          => 'button_group',
									'choices'       => array(
										'upload' => 'WordPress upload',
										'url'    => 'Video link or path',
									),
									'default_value' => 'upload',
								),
								array(
									'key'           => 'field_adure_hero_video_upload',
									'label'         => 'Background Video',
									'name'          => 'hero_video_upload',
									'type'          => 'file',
									'return_format' => 'url',
									'mime_types'    => 'mp4,m4v,webm',
								),
								array(
									'key'          => 'field_adure_hero_video_url',
									'label'        => 'Video Link or Path',
									'name'         => 'hero_video_url',
									'type'         => 'text',
									'instructions' => 'Accepts a full URL or a relative path such as /videos/hero.mp4.',
								),
								array(
									'key'           => 'field_adure_hero_poster',
									'label'         => 'Video Poster',
									'name'          => 'hero_poster',
									'type'          => 'image',
									'return_format' => 'url',
									'preview_size'  => 'medium',
									'library'       => 'all',
								),
								array(
									'key'          => 'field_adure_hero_buttons',
									'label'        => 'Buttons',
									'name'         => 'hero_buttons',
									'type'         => 'repeater',
									'layout'       => 'table',
									'min'          => 1,
									'max'          => 2,
									'button_label' => 'Add button',
									'sub_fields'   => array(
										array(
											'key'   => 'field_adure_hero_button_label',
											'label' => 'Label',
											'name'  => 'label',
											'type'  => 'text',
										),
										array(
											'key'          => 'field_adure_hero_button_href',
											'label'        => 'Link or Path',
											'name'         => 'href',
											'type'         => 'text',
											'instructions' => 'Accepts a full URL or a relative path such as /about.',
										),
									),
								),
							),
						),
					),
				),
			),
			'location' => array(
				array(
					array(
						'param'    => 'post',
						'operator' => '==',
						'value'    => (string) $page_id,
					),
				),
			),
			'position'      => 'acf_after_title',
			'style'         => 'seamless',
			'show_in_rest'  => 1,
		)
	);

	if ( get_field( 'home_components', $page_id ) ) {
		return;
	}

	$video_id = adure_home_hero_video_attachment( $page_id );
	update_field(
		'field_adure_home_components',
		array(
			array(
				'acf_fc_layout'                         => 'hero',
				'field_adure_hero_heading'              => "Creating Value\nBeyond Property",
				'field_adure_hero_description'          => 'A connected approach to real estate, shaped in Abu Dhabi.',
				'field_adure_hero_video_source'         => 'upload',
				'field_adure_hero_video_upload'         => $video_id,
				'field_adure_hero_buttons'              => array(
					array(
						'field_adure_hero_button_label' => 'Explore ADURE',
						'field_adure_hero_button_href'  => '/about',
					),
					array(
						'field_adure_hero_button_label' => 'Find a property',
						'field_adure_hero_button_href'  => '/properties',
					),
				),
			),
		),
		$page_id
	);
}
add_action( 'acf/init', 'adure_register_home_components' );

function adure_seed_home_journeys() {
	if ( get_option( 'adure_home_journeys_seeded' ) ) {
		return;
	}

	$page_id = adure_home_page_id();
	$base    = content_url( 'uploads/adure/' );
	$cards   = array(
		array( 'field_adure_journey_image' => $base . 'journey-buy.webp', 'field_adure_journey_image_alt' => 'Waterfront residences', 'field_adure_journey_title' => 'Buy', 'field_adure_journey_description' => 'Choose with clarity. Discover opportunities with guidance grounded in the market.', 'field_adure_journey_button_text' => 'Buy with ADURE', 'field_adure_journey_button_href' => '/properties' ),
		array( 'field_adure_journey_image' => $base . 'journey-sell.jpg', 'field_adure_journey_image_alt' => 'Property advisor', 'field_adure_journey_title' => 'Sell', 'field_adure_journey_description' => 'Position for the right value. Bring your property to market with considered positioning and the right audience.', 'field_adure_journey_button_text' => 'Sell with ADURE', 'field_adure_journey_button_href' => '/sell' ),
		array( 'field_adure_journey_image' => $base . 'journey-lease-lobby.jpg', 'field_adure_journey_image_alt' => 'Marble lobby', 'field_adure_journey_title' => 'Lease', 'field_adure_journey_description' => 'Connect people with place. Create the right match between properties, owners and occupants.', 'field_adure_journey_button_text' => 'Lease with ADURE', 'field_adure_journey_button_href' => '/properties' ),
		array( 'field_adure_journey_image' => $base . 'journey-manage.jpg', 'field_adure_journey_image_alt' => 'Property management professional', 'field_adure_journey_title' => 'Manage', 'field_adure_journey_description' => 'Protect what comes next. Keep assets performing through connected management for the long term.', 'field_adure_journey_button_text' => 'Property management', 'field_adure_journey_button_href' => '/management' ),
	);

	update_field( 'field_adure_journey_components', array( array( 'acf_fc_layout' => 'journeys', 'field_adure_journeys_heading' => 'One Partner for Every Property Move', 'field_adure_journeys_description' => 'Real estate rarely begins and ends with one decision. ADURE brings the expertise at every stage, so each move builds naturally into the next.', 'field_adure_journeys_pt' => 'pt_100', 'field_adure_journeys_pb' => 'pb_100', 'field_adure_journeys_cards' => $cards ) ), $page_id );
	update_option( 'adure_home_journeys_seeded', 1, false );
}
add_action( 'acf/init', 'adure_seed_home_journeys', 20 );

function adure_journey_image_attachment( $page_id, $filename, $title ) {
	$uploads = wp_upload_dir();
	$path    = trailingslashit( $uploads['basedir'] ) . 'adure/' . $filename;
	$url     = trailingslashit( $uploads['baseurl'] ) . 'adure/' . $filename;
	$id      = attachment_url_to_postid( $url );

	if ( $id || ! file_exists( $path ) ) {
		return (int) $id;
	}

	return (int) wp_insert_attachment( array( 'post_mime_type' => wp_check_filetype( $filename )['type'], 'post_title' => $title, 'post_status' => 'inherit', 'guid' => $url ), $path, $page_id );
}

function adure_migrate_journey_images() {
	if ( get_option( 'adure_home_journey_images_seeded' ) ) return;
	$page_id = adure_home_page_id();
	$components = get_field( 'journey_components', $page_id );
	if ( ! is_array( $components ) || empty( $components[0]['cards'] ) ) return;
	$images = array( array( 'journey-buy.webp', 'Buy' ), array( 'journey-sell.jpg', 'Sell' ), array( 'journey-lease-lobby.jpg', 'Lease' ), array( 'journey-manage.jpg', 'Manage' ) );
	foreach ( $images as $index => $image ) $components[0]['cards'][ $index ]['image'] = adure_journey_image_attachment( $page_id, $image[0], $image[1] );
	update_field( 'field_adure_journey_components', $components, $page_id );
	update_option( 'adure_home_journey_images_seeded', 1, false );
}
add_action( 'acf/init', 'adure_migrate_journey_images', 30 );
