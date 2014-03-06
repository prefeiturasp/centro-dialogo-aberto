'use strict';
var AA;
function resize () {
	var height = $(window).height() - $('.navbar').height();
	$('.home_grid').height(height);
}
jQuery(function() {
	// Cross browsing placeholder
	$('input, textarea').placeholder();

	$('.form-group.edit button').bind('click',function() {
		var input = $(this).siblings('input:text,input:password');
		console.log(input);

		input.attr('disabled',!input.attr('disabled'));

	});

	if ($('.steps.voting').length) {

		var s = { //steps

			total : 12, // NUMERO DE PERGUNTAS
			current : 1,
			votes : new Array(this.total),
			pts : {
				'happy' : 3,
				'neutral' : 2,
				'unhappy' : 1,
				'next' : 'x'
			},

			// content : 

			init  : function() {

				$('.steps .footer .next, .emot a').bind('click',s.vote);
				$('.steps .footer .finish').bind('click',s.finish);
				$('.steps .footer .prev').bind('click',s.prev);
				s.load();

			},

			vote : function() {

				s.votes[s.current-1] = s.pts[this.className];
				s.next();

			},

			load : function(n) {

				n = n || s.current;

				var content = $('.steps_content .step' + n).html();

				$('.step_content').html(content);
				$('.steps .footer .counter').text(s.current + '/' + s.total);


			},

			next : function() {

				if (s.current === s.total) {
					$('.steps .footer .next').hide();
					$('.steps .footer .finish').show();
				} else {
					s.current++;
				}

				$('.steps .footer .prev').show();

				s.load();

			},

			prev : function() {
				s.current--;

				$('.steps .footer .next').show();
				$('.steps .footer .finish').hide();

				if (s.current === 1) {
					$('.steps .footer .prev').hide();
				}

				// if (s.votes) // TODO: Indicar qual a pessoa votou


				s.load();
			},

			finish : function() {

				window.location.href = '../resultados?voting=' + s.votes.join(',');

			}


		};

		s.init();



	}

	if ($('.home_grid').length) {

		$(window).resize(resize);
		resize();

	}



	jQuery(document).ready(function() {
		jQuery('.carousel').carousel({interval:1500});
	});



	if ($('.proposta').length) {

		var tabs = $('.content-header .tabs .tab a'),
			width = 100/tabs.length-10;

		$('.carousel').carousel({
			interval: 3000
		});

		$('#gallery2 .control').bind('click',function(){

			var gallery2 = $('#gallery2');

			if (gallery2.hasClass('paused')) {
				
				gallery2
					.carousel('cycle')
					.removeClass('paused');
				
			} else {

				gallery2
					.carousel('pause')
					.addClass('paused');



			}

		});

		$('#gallery2 .play span').bind('click',function(){



		});


		var userComent = {

			open : function() {

				$('.user_comment').slideDown('fast');
				$('.vote .quotes').addClass('selected');
				$('.user_comment input:text').focus();

			},

			close : function() {

				$('.user_comment').slideUp('fast');
				$('.vote .quotes').removeClass('selected');

			},

			toggle : function() {

				if ($('.vote .quotes').hasClass('selected')) {
					userComent.close();
				} else {
					userComent.open();
				}

			}


		};

		$('.vote .quotes').bind('click',userComent.toggle);

		var vote = function() {

			var direction = this.id,
				action = $(this).parent().hasClass('selected') ? 'dislike' : 'like',
				url = $(this).data('url'),
				sibling = $(this).parent().siblings('.up,.down'),
				counter = $(this).children('p');

			$(this)
				.parent()
					.toggleClass('selected');

			if (action === 'like') {
				counter.text(parseInt(counter.text())+1);
			} else {
				counter.text(parseInt(counter.text())-1);
			}

			$.post(url + '/' + direction + '/' + action);

			if (sibling.hasClass('selected')) {

				counter = sibling.find('p');
				counter.text(parseInt(counter.text())-1);
				sibling.removeClass('selected');

				direction = direction === 'up' ? 'down': 'up';

				$.post(url + '/' + direction + '/dislike');

			}

			userComent.open();

		};

		$('#up,#down','.vote').bind('click',vote);
		

		$('form#comment').bind('submit',function(e,o){

			var form = $(this),
				url = form.attr('action'),
				input = form.children('input:text');

			$.ajax({
				type: "POST",
				url: url,
				data: {
					'comment' : input.val()
				},
				success : function (comment) {

					$('.no_comments').hide();

					$('.comments .comments_wrapper')
						.prepend('<div style="display: none;" class="comment user_hold"> <p class="comment_hold">Comentário aguardando aprovação</p> <p class="comment_author">' + comment.comment_author + '</p> <p class="comment_time">Agora</p>  <p class="comment_title">' + comment.comment_content + '</p></div>')
						.children('div:first')
							.fadeIn('slow');

					userComent.close();

					input.val('');

				},
				dataType: 'json'
			});

			return false;

		});

	}

	if ($('.edit_points').length) {

		var map,img,points,pts,list,mapTop,mapLeft;

		var PTS = {

			init : function() {

				map = $('.map_zone');
				list = map.data('points');
				img = $('img',map);
				// list = '';
				mapTop = parseInt($('.map_zone').position().top);
				mapLeft = parseInt($('.map_zone').position().left);

				pts = $('.map_zone .point');
				PTS.load();

				map.bind('click',PTS.mapClick);

			},

			load : function() {

				var listArr = list.split('l');
					listArr.shift();

				$(listArr).each(function(i,o){
					PTS.plot(o.split('x'));
				});

			},

			mapClick : function(e) {

				if (e.target.id ===	'map') {
					PTS.includePoint(e);
				} else {
					PTS.removePoint(e);
				}

			},

			includePoint : function(e) {

				var x = e.clientX - mapLeft;
				var y = e.clientY - mapTop;
				var imgW = img.width();
				var imgH = img.height();

				// x = x*100/imgW;
				// y = y*100/imgH;

				x = Math.round(x*100/imgW);
				y = Math.round(y*100/imgH);

				PTS.plot([x,y]);

				list = list + 'l' + x + 'x' + y;

				PTS.updateDb();

			},

			removePoint : function(e) {

				var pt = e.target;
				var coord = $(pt).data('coord');

				list = list.replace('l' + coord,'');

				PTS.updateDb();

				$(pt).remove();


			},

			plot : function(coord) {

				$('.points').append('<div class="pt pt_del" data-coord="' + coord.join('x') + '" style="left:' + coord[0] + '%;top:' + coord[1] + '%"></div>');

			},

			update : function() {

				pts = $('.map_zone .point');

				


			},

			updateDb : function() {

				$.post(window.location.href.replace('edit_', 'update_') + list);

			}

		};

		PTS.init();

	}

	if ($('.sugestao').length) {

		var S = {

			init : function() {

				$('.point','.map_zone .spots').bind('click',function() {
					if ($(this).hasClass('selected')) {
						S.unselectSpot(this);
					} else {
						S.selectSpot(this);
					}
				});

				$('.point','.points').bind('click',S.choosePoint);

			},

			selectSpot : function(obj) {

				$('.point','.map_zone .spots').removeClass('selected');
				$(obj).addClass('selected');

				var id = obj.id.length ? obj.id.replace('pt_','') : null;

				S.selectPoint(id);
				S.selectInfo(id);

			},

			unselectSpot : function(obj) {

				$(obj).removeClass('selected');

				S.unselectPoint();

			},

			selectPoint : function(id) {

				$('.points')
					.removeClass('disabled')
					.find('.point')
						.removeClass('selected');

				if (id) {
					$('.points #point_' + id).addClass('selected');
				}

			},

			unselectPoint : function() {

				$('.points')
					.toggleClass('disabled enabled')
					.find('.point')
						.removeClass('selected');


			},

			selectInfo : function(id) {

				$('.point','.info').removeClass();

				if (id) {
					$('.point_info','.info')
						.html($('.point_wrapper_' + id).html());

					$('.tab_minha_sugestao .point_info').show();

				} else {
					$('.tab_minha_sugestao .point_info').hide();
				}


			},

			unselectInfo : function() {




			},

			choosePoint : function() {

				if ($('.points').hasClass('disabled enabled')) {
					return;
				}

				var id = this.id.replace('point_','');

				var spot = $('.point.selected','.map_zone .spots');
				// var info = 

				var spotId = spot[0].id;

				spot
					.attr('id','pt_' + id)
					.removeClass(spotId)
					.addClass('pt_' + id);


				S.selectPoint(id);
				S.selectInfo(id);

			}



		};

		S.init();

	}


	
});