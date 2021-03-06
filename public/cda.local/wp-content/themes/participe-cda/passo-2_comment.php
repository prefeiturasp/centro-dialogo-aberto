<?php
/**
 * The Template for displaying all single posts
 *
 * Methods for TimberHelper can be found in the /functions sub-directory
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since    Timber 0.1
 */

$context = Timber::get_context();
$post_slug = get_query_var('post_name');

$get_post_args = array(
  'name' => $post_slug,
  'post_type' => 'proposta',
  'post_status' => 'publish',
  'numberposts' => 1
);
$get_post = get_posts($get_post_args);
if (count($post) > 0) $post = $get_post[0];


if (get_query_var('username')){
    $current_user = get_user_by('login', get_query_var('username'));
} else {
    global $current_user;
    get_currentuserinfo();
}

$comment = $_POST["comment"];
// $comment = ' kh kjh k jhkh kh khkj hkjh jkh kj hkjh k!';
$time = current_time('mysql');
$data = array(
    'comment_author' => $current_user->user_nicename,
    'comment_author_email' => $user_email,
    'comment_author_url' => $user_url,
    'comment_content' => $comment,
    'comment_post_ID' => $post->ID,
    'comment_author' => $current_user->user_login,
    'user_id' => $current_user->ID,
    'comment_date' => $time,
    'comment_approved' => 0,
    'post_type' => 'proposta'
);

$comment_id = wp_insert_comment($data);

echo '{ ';

foreach  ($data as $key => $value){
    echo '"' . $key . '" : "' . $value . '",';
}

echo '"comment_id" : ' . $comment_id . '}';


?>