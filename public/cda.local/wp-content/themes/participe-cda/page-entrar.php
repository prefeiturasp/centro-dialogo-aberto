<?php
/**
 * The template for displaying all pages.
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site will use a
 * different template.
 *
 * To generate specific templates for your pages you can use:
 * /mytheme/views/page-mypage.twig
 * (which will still route through this PHP file)
 * OR
 * /mytheme/page-mypage.php
 * (in which case you'll want to duplicate this file and save to the above path)
 *
 * Methods for TimberHelper can be found in the /functions sub-directory
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since    Timber 0.1
 */

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;
$context['form_action'] = get_bloginfo('home').'/entrar/';
$context['redirect_to'] = $_GET['redirect_to'];
$context['wp_lostpassword_url'] = wp_lostpassword_url();




switch($_GET['action']) {
    case 'login':
        $username    = $_POST['user_name'];
        $password    = $_POST['user_password'];
        if (empty($_POST['redirect_to'])) {
            $redirect_to = get_bloginfo('home');
        } else {
            $redirect_to = $_POST['redirect_to'];
        }

        // log in automatically
        if ( !is_user_logged_in() ) {
            $auth = wp_authenticate($username, $password);

            if (is_wp_error($auth)) {
                $context['mensagem'] = $auth->get_error_message();
            }else {
                $user = get_userdatabylogin( $username );
                $user_id = $user->ID;
                wp_set_current_user( $user_id, $username );
                wp_set_auth_cookie( $user_id );
                wp_redirect($redirect_to);
                exit;
            }
        }
        break;
    case 'register':
        $user_name     = $_POST['user_name'];
        $user_email    = $_POST['user_email'];
        $user_password = $_POST['user_password'];
        $user_password = $_POST['user_password_repeat'];
        if (empty($_POST['redirect_to'])) {
            $redirect_to = get_bloginfo('home');
        } else {
            $redirect_to = $_POST['redirect_to'];
        }

        $user_id = username_exists( $user_name );
        if ( !$user_id and email_exists($user_email) == false ) {
            $user_id = wp_create_user( $user_name, $user_password, $user_email );

            // log in automatically
            if ( !is_user_logged_in() ) {
                $auth = wp_authenticate($user_name, $user_password);

                if (is_wp_error($auth)) {
                    $context['mensagem'] = $auth->get_error_message();
                }else {
                    $user = get_userdatabylogin( $username );
                    $user_id = $user->ID;
                    wp_set_current_user( $user_id, $username );
                    wp_set_auth_cookie( $user_id );
                    wp_redirect($redirect_to);
                    exit;
                }
            }
        } else {
            $context['mensagem'] = __('Apelido já existente');
        }
        break;
    case 'logout':
        wp_logout();
        wp_redirect(get_bloginfo('home'));
        exit;
        break;
    
    default:
        # code...
        break;
}



 

var_dump($_POST);

Timber::render(array('page-' . $post->post_name . '.twig', 'page.twig'), $context);