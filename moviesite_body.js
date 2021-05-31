/*! Theia Sticky Sidebar | v1.7.0 - https://github.com/WeCodePixels/theia-sticky-sidebar */
(function($){$.fn.theiaStickySidebar=function(options){var defaults={'containerSelector':'','additionalMarginTop':0,'additionalMarginBottom':0,'updateSidebarHeight':true,'minWidth':0,'disableOnResponsiveLayouts':true,'sidebarBehavior':'modern','defaultPosition':'relative','namespace':'TSS'};options=$.extend(defaults,options);options.additionalMarginTop=parseInt(options.additionalMarginTop)||0;options.additionalMarginBottom=parseInt(options.additionalMarginBottom)||0;tryInitOrHookIntoEvents(options,this);function tryInitOrHookIntoEvents(options,$that){var success=tryInit(options,$that);if(!success){console.log('TSS: Body width smaller than options.minWidth. Init is delayed.');$(document).on('scroll.'+options.namespace,function(options,$that){return function(evt){var success=tryInit(options,$that);if(success){$(this).unbind(evt)}}}(options,$that));$(window).on('resize.'+options.namespace,function(options,$that){return function(evt){var success=tryInit(options,$that);if(success){$(this).unbind(evt)}}}(options,$that))}}function tryInit(options,$that){if(options.initialized===true){return true}if($('body').width()<options.minWidth){return false}init(options,$that);return true}function init(options,$that){options.initialized=true;var existingStylesheet=$('#theia-sticky-sidebar-stylesheet-'+options.namespace);if(existingStylesheet.length===0){$('head').append($('<style id="theia-sticky-sidebar-stylesheet-'+options.namespace+'">.theiaStickySidebar:after {content: ""; display: table; clear: both;}</style>'))}$that.each(function(){var o={};o.sidebar=$(this);o.options=options||{};o.container=$(o.options.containerSelector);if(o.container.length==0){o.container=o.sidebar.parent()}o.sidebar.parents().css('-webkit-transform','none');o.sidebar.css({'position':o.options.defaultPosition,'overflow':'visible','-webkit-box-sizing':'border-box','-moz-box-sizing':'border-box','box-sizing':'border-box'});o.stickySidebar=o.sidebar.find('.theiaStickySidebar');if(o.stickySidebar.length==0){var javaScriptMIMETypes=/(?:text|application)\/(?:x-)?(?:javascript|ecmascript)/i;o.sidebar.find('script').filter(function(index,script){return script.type.length===0||script.type.match(javaScriptMIMETypes)}).remove();o.stickySidebar=$('<div>').addClass('theiaStickySidebar').append(o.sidebar.children());o.sidebar.append(o.stickySidebar)}o.marginBottom=parseInt(o.sidebar.css('margin-bottom'));o.paddingTop=parseInt(o.sidebar.css('padding-top'));o.paddingBottom=parseInt(o.sidebar.css('padding-bottom'));var collapsedTopHeight=o.stickySidebar.offset().top;var collapsedBottomHeight=o.stickySidebar.outerHeight();o.stickySidebar.css('padding-top',1);o.stickySidebar.css('padding-bottom',1);collapsedTopHeight-=o.stickySidebar.offset().top;collapsedBottomHeight=o.stickySidebar.outerHeight()-collapsedBottomHeight-collapsedTopHeight;if(collapsedTopHeight==0){o.stickySidebar.css('padding-top',0);o.stickySidebarPaddingTop=0}else{o.stickySidebarPaddingTop=1}if(collapsedBottomHeight==0){o.stickySidebar.css('padding-bottom',0);o.stickySidebarPaddingBottom=0}else{o.stickySidebarPaddingBottom=1}o.previousScrollTop=null;o.fixedScrollTop=0;resetSidebar();o.onScroll=function(o){if(!o.stickySidebar.is(":visible")){return}if($('body').width()<o.options.minWidth){resetSidebar();return}if(o.options.disableOnResponsiveLayouts){var sidebarWidth=o.sidebar.outerWidth(o.sidebar.css('float')=='none');if(sidebarWidth+50>o.container.width()){resetSidebar();return}}var scrollTop=$(document).scrollTop();var position='static';if(scrollTop>=o.sidebar.offset().top+(o.paddingTop-o.options.additionalMarginTop)){var offsetTop=o.paddingTop+options.additionalMarginTop;var offsetBottom=o.paddingBottom+o.marginBottom+options.additionalMarginBottom;var containerTop=o.sidebar.offset().top;var containerBottom=o.sidebar.offset().top+getClearedHeight(o.container);var windowOffsetTop=0+options.additionalMarginTop;var windowOffsetBottom;var sidebarSmallerThanWindow=(o.stickySidebar.outerHeight()+offsetTop+offsetBottom)<$(window).height();if(sidebarSmallerThanWindow){windowOffsetBottom=windowOffsetTop+o.stickySidebar.outerHeight()}else{windowOffsetBottom=$(window).height()-o.marginBottom-o.paddingBottom-options.additionalMarginBottom}var staticLimitTop=containerTop-scrollTop+o.paddingTop;var staticLimitBottom=containerBottom-scrollTop-o.paddingBottom-o.marginBottom;var top=o.stickySidebar.offset().top-scrollTop;var scrollTopDiff=o.previousScrollTop-scrollTop;if(o.stickySidebar.css('position')=='fixed'){if(o.options.sidebarBehavior=='modern'){top+=scrollTopDiff}}if(o.options.sidebarBehavior=='stick-to-top'){top=options.additionalMarginTop}if(o.options.sidebarBehavior=='stick-to-bottom'){top=windowOffsetBottom-o.stickySidebar.outerHeight()}if(scrollTopDiff>0){top=Math.min(top,windowOffsetTop)}else{top=Math.max(top,windowOffsetBottom-o.stickySidebar.outerHeight())}top=Math.max(top,staticLimitTop);top=Math.min(top,staticLimitBottom-o.stickySidebar.outerHeight());var sidebarSameHeightAsContainer=o.container.height()==o.stickySidebar.outerHeight();if(!sidebarSameHeightAsContainer&&top==windowOffsetTop){position='fixed'}else if(!sidebarSameHeightAsContainer&&top==windowOffsetBottom-o.stickySidebar.outerHeight()){position='fixed'}else if(scrollTop+top-o.sidebar.offset().top-o.paddingTop<=options.additionalMarginTop){position='static'}else{position='absolute'}}if(position=='fixed'){var scrollLeft=$(document).scrollLeft();o.stickySidebar.css({'position':'fixed','width':getWidthForObject(o.stickySidebar)+'px','transform':'translateY('+top+'px)','left':(o.sidebar.offset().left+parseInt(o.sidebar.css('padding-left'))-scrollLeft)+'px','top':'0px'})}else if(position=='absolute'){var css={};if(o.stickySidebar.css('position')!='absolute'){css.position='absolute';css.transform='translateY('+(scrollTop+top-o.sidebar.offset().top-o.stickySidebarPaddingTop-o.stickySidebarPaddingBottom)+'px)';css.top='0px'}css.width=getWidthForObject(o.stickySidebar)+'px';css.left='';o.stickySidebar.css(css)}else if(position=='static'){resetSidebar()}if(position!='static'){if(o.options.updateSidebarHeight==true){o.sidebar.css({'min-height':o.stickySidebar.outerHeight()+o.stickySidebar.offset().top-o.sidebar.offset().top+o.paddingBottom})}}o.previousScrollTop=scrollTop};o.onScroll(o);$(document).on('scroll.'+o.options.namespace,function(o){return function(){o.onScroll(o)}}(o));$(window).on('resize.'+o.options.namespace,function(o){return function(){o.stickySidebar.css({'position':'static'});o.onScroll(o)}}(o));if(typeof ResizeSensor!=='undefined'){new ResizeSensor(o.stickySidebar[0],function(o){return function(){o.onScroll(o)}}(o))}function resetSidebar(){o.fixedScrollTop=0;o.sidebar.css({'min-height':'1px'});o.stickySidebar.css({'position':'static','width':'','transform':'none'})}function getClearedHeight(e){var height=e.height();e.children().each(function(){height=Math.max(height,$(this).height())});return height}})}function getWidthForObject(object){var width;try{width=object[0].getBoundingClientRect().width}catch(err){}if(typeof width==="undefined"){width=object.width()}return width}return this}})(jQuery);


<!-- Theme Functions JS -->
<script type='text/javascript'>
//<![CDATA[
$('#main-menu').each(function() {
    var iTms = $(this).find('.LinkList ul > li').children('a'),
        iLen = iTms.length;
    for (var i = 0; i < iLen; i++) {
        var i1 = iTms.eq(i),
            t1 = i1.text();
        if (t1.charAt(0) !== '_') {
            var i2 = iTms.eq(i + 1),
                t2 = i2.text();
            if (t2.charAt(0) === '_') {
                var l1 = i1.parent();
                l1.append('<ul class="sub-menu m-sub"/>');
            }
        }
        if (t1.charAt(0) === '_') {
            i1.text(t1.replace('_', ''));
            i1.parent().appendTo(l1.children('.sub-menu'));
        }
    }
    for (var i = 0; i < iLen; i++) {
        var i3 = iTms.eq(i),
            t3 = i3.text();
        if (t3.charAt(0) !== '_') {
            var i4 = iTms.eq(i + 1),
                t4 = i4.text();
            if (t4.charAt(0) === '_') {
                var l2 = i3.parent();
                l2.append('<ul class="sub-menu2 m-sub"/>');
            }
        }
        if (t3.charAt(0) === '_') {
            i3.text(t3.replace('_', ''));
            i3.parent().appendTo(l2.children('.sub-menu2'));
        }
    }
    $('#main-menu ul li ul').parent('li').addClass('has-sub');
    $('#main-menu .widget').addClass('show-menu');
});
$(function() {
    $('#main-menu-nav').clone().appendTo('.mobile-menu');
    $('.mobile-menu .has-sub').append('<div class="submenu-toggle"/>');
    $('.mobile-menu-toggle').on('click', function() {
        $('body').toggleClass('nav-active');
        $('.overlay').fadeToggle(170);
    });
    $('.mobile-menu ul li .submenu-toggle').on('click', function($this) {
        if ($(this).parent().hasClass('has-sub')) {
            $this.preventDefault();
            if (!$(this).parent().hasClass('show')) {
                $(this).parent().addClass('show').children('.m-sub').slideToggle(170);
            } else {
                $(this).parent().removeClass('show').find('> .m-sub').slideToggle(170);
            }
        }
    });
    $('.show-search').on('click', function() {
        $('#nav-search, .mobile-search-form').fadeIn(250).find('input').focus();
    });
    $('.hide-search').on('click', function() {
        $('#nav-search, .mobile-search-form').fadeOut(250).find('input').blur();
    });
    $('.Label a').attr('href', function($this, href) {
        return href.replace(href, href + '?&max-results=' + postPerPage);
    });
    $('.avatar-image-container img').attr('src', function($this, i) {
        i = i.replace('/s35-c/', '/s45-c/');
        i = i.replace('//img1.blogblog.com/img/blank.gif', '//4.bp.blogspot.com/-uCjYgVFIh70/VuOLn-mL7PI/AAAAAAAADUs/Kcu9wJbv790hIo83rI_s7lLW3zkLY01EA/s55-r/avatar.png');
        return i;
    });
    $('.author-description a').each(function() {
        $(this).attr('target', '_blank');
    });
    $('.post-nav').each(function() {
        var getURL_prev = $('a.prev-post-link').attr('href'),
            getURL_next = $('a.next-post-link').attr('href');
        $.ajax({
            url: getURL_prev,
            type: 'get',
            success: function(prev) {
                var title = $(prev).find('.blog-post h1.post-title').text();
                $('.post-prev a .post-nav-inner p').text(title);
            }
        });
        $.ajax({
            url: getURL_next,
            type: 'get',
            success: function(next) {
                var title = $(next).find('.blog-post h1.post-title').text();
                $('.post-next a .post-nav-inner p').text(title);
            }
        });
    });
    $('.post-body strike').each(function() {
        var $this = $(this),
            type = $this.text();
        if (type.match('left-sidebar')) {
            $this.replaceWith('<style>.item #main-wrapper{float:right}.item #sidebar-wrapper{float:left}</style>');
        }
        if (type.match('right-sidebar')) {
            $this.replaceWith('<style>.item #main-wrapper{float:left}.item #sidebar-wrapper{float:right}</style>');
        }
        if (type.match('full-width')) {
            $this.replaceWith('<style>.item #main-wrapper{width:100%}.item #sidebar-wrapper{display:none}</style>');
        }
    });
    $('#main-wrapper, #sidebar-wrapper').each(function() {
        if (fixedSidebar == true) {
            $(this).theiaStickySidebar({
                additionalMarginTop: 40,
                additionalMarginBottom: 40
            });
        }
    });
    $('.back-top').each(function() {
        var $this = $(this);
        $(window).on('scroll', function() {
            $(this).scrollTop() >= 100 ? $this.fadeIn(250) : $this.fadeOut(250)
        }), $this.click(function() {
            $('html, body').animate({
                scrollTop: 0
            }, 500)
        });
    });
$('#hot-section .widget-content').each(function() {
        var $this = $(this),
            text = $this.text().trim(),
            type = text.toLowerCase(),
            map = text.split('/'),
            label = map[0];
        ajaxPosts($this, type, 4, label);
    });
    $('.common-widget .widget-content').each(function() {
        var $this = $(this),
            text = $this.text().trim(),
            type = text.toLowerCase(),
            map = text.split('/'),
            num = map[0],
            label = map[1];
        ajaxPosts($this, type, num, label);
    });
    $('.related-ready').each(function() {
        var $this = $(this),
            label = $this.find('.related-tag').data('label');
        ajaxPosts($this, 'related', 3, label);
    });

    function post_link(feed, i) {
        for (var x = 0; x < feed[i].link.length; x++)
            if (feed[i].link[x].rel == 'alternate') {
                var link = feed[i].link[x].href;
                break
            }
        return link;
    }

    function post_title(feed, i, link) {
        var n = feed[i].title.$t,
            code = '<a href="' + link + '">' + n + '</a>';
        return code;
    }

    function post_date(feed, i) {
        var c = feed[i].published.$t,
            d = c.substring(0, 4),
            f = c.substring(5, 7),
            m = c.substring(8, 10),
            h = monthFormat[parseInt(f, 10) - 1] + ' ' + m + ', ' + d;
        var code = '<span class="post-date">' + h + '</span>';
        return code;
    }

   function post_image(feed, i) {
        var n = feed[i].title.$t,
            p = feed[i].content.$t,
            u = $('<div>').html(p);
        if ('media$thumbnail' in feed[i]) {
            var src = feed[i].media$thumbnail.url,
                s1 = src.replace('/s72-c', '/w680');
          if (src.match('img.youtube.com')) {
                s1 = src.replace('/default.', '/hqdefault.');
            }
        } else if (p.indexOf('<img') > -1) {
            s1 = u.find('img:first').attr('src');
        } else {
            s1 = noThumbnail;
        }
        var code = '<img class="post-thumb" alt="' + n + '" src="' + s1 + '"/>';
        return code;
    }

    function post_label(feed, i) {
        if (feed[i].category != undefined) {
            var tag = feed[i].category[0].term,
                code = '<span class="post-tag">' + tag + '</span>';
        } else {
            code = '';
        }
        return code;
    }

    function ajaxPosts($this, type, num, label) {
        if (type.match('hot-posts') || type.match('post-list') || type.match('related')) {
            var url = '';
            if (label == 'recent') {
                url = '/feeds/posts/default?alt=json-in-script&max-results=' + num;
            } else if (label == 'random') {
                var index = Math.floor(Math.random() * num) + num;
                url = '/feeds/posts/default?max-results=' + num + '&start-index=' + index + '&alt=json-in-script';
            } else {
                url = '/feeds/posts/default/-/' + label + '?alt=json-in-script&max-results=' + num;
            }
            $.ajax({
                url: url,
                type: 'get',
                dataType: 'jsonp',
                beforeSend: function() {
                    if (type.match('hot-posts')) {
                        $this.html('<div class="hot-loader"/>').parent().addClass('show-hot');
                    }
                },
                success: function(json) {
                    if (type.match('hot-posts')) {
                        var kode = '<ul class="hot-posts">';
                    }  else if (type.match('post-list')) {
                        var kode = '<ul class="custom-widget">';
                    }
                    if (type.match('related')) {
                        var kode = '<ul class="related-posts">';
                    }
                    var entry = json.feed.entry;
                    if (entry != undefined) {
                        for (var i = 0, feed = entry; i < feed.length; i++) {
                            var link = post_link(feed, i),
                                title = post_title(feed, i, link),
                                image = post_image(feed, i),
                                tag = post_label(feed, i),
                                date = post_date(feed, i);
                            var kontent = '';
                           if (type.match('hot-posts')) {                            
                                    kontent += '<li class="hot-item item-' + i + '"><div class="hot-item-inner"><a class="post-image-link" href="' + link + '">' + image + '</a><div class="post-info"><h2 class="post-title">' + title + '</h2><div class="post-meta"></div></div></div></li>';
                            } else if (type.match('post-list')) {
                                kontent += '<li><a class="post-image-link" href="' + link + '">' + image + '</a><h2 class="post-title">' + title + '</h2><div class="post-meta">' + date + '</div></div></li>';
                            } else if (type.match('related')) {
                                kontent += '<li class="related-item"><div class="post-image-wrap"><a class="post-image-link" href="' + link + '">' + image + '</a></div><h2 class="post-title">' + title + '</h2><div class="post-meta">' + date + '</div></li>';
                            }
                            kode += kontent;
                        }
                        kode += '</ul>';
                    } else {
                        kode = '<ul class="no-posts">Error: No Results Found <i class="fa fa-frown-o"/></ul>';
                    }
                    if (type.match('hot-posts')) {
                        $this.html(kode).parent().addClass('show-hot');
                    } else {
                        $this.html(kode);
                    }
                }
            });
        }
    }
    $('.blog-post-comments').each(function() {
        var system = commentsSystem,
            disqus_url = disqus_blogger_current_url,
            disqus = '<div id="disqus_thread"/>',
            current_url = $(location).attr('href'),
            facebook = '<div class="fb-comments" data-width="100%" data-href="' + current_url + '" data-numposts="5"></div>',
            sClass = 'comments-system-' + system;
        if (system == 'blogger') {
            $(this).addClass(sClass).show();
        } else if (system == 'disqus') {
            (function() {
                var dsq = document.createElement('script');
                dsq.type = 'text/javascript';
                dsq.async = true;
                dsq.src = '//' + disqusShortname + '.disqus.com/embed.js';
                (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
            })();
            $('#comments, #gpluscomments').remove();
            $(this).append(disqus).addClass(sClass).show();
        } else if (system == 'facebook') {
            $('#comments, #gpluscomments').remove();
            $(this).append(facebook).addClass(sClass).show();
        } else if (system == 'hide') {
            $(this).hide();
        } else {
            $(this).addClass('comments-system-blogger').show();
        }
    });
});
//]]>

<!-- Pagination Scripts -->

//<![CDATA[
var postResults=postPerPage;
var numOfPages=2;
var pageOf=["Page", "of"];
eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('5 K;5 m;5 l;5 w;5 s=1p.9;5 y="/";1d();G 1b(a){5 b=\'\';J=M(W/2);4(J==W-J){W=J*2+1}D=l-J;4(D<1)D=1;j=M(a/n)+1;4(j-1==a/n)j=j-1;E=D+W-1;4(E>j)E=j;b+=\'<C 6="3-1u">\'+17[0]+\' \'+l+\' \'+17[1]+\' \'+j+\'</C>\';5 c=M(l)-1;4(l>1){4(l==2){4(m==\'3\'){b+=\'<a 6="3-7 3-U" 9="\'+y+\'"></a>\'}h{b+=\'<a 6="3-7 3-U" 9="/v/u/\'+w+\'?&i-o=\'+n+\'"></a>\'}}h{4(m==\'3\'){b+=\'<a 6="3-7 3-U" 9="#" z="L(\'+c+\');B x"></a>\'}h{b+=\'<a 6="3-7 3-U" 9="#" z="I(\'+c+\');B x"></a>\'}}}4(D>1){4(m=="3"){b+=\'<a 6="3-7" 9="\'+y+\'">1</a>\'}h{b+=\'<a 6="3-7" 9="/v/u/\'+w+\'?&i-o=\'+n+\'">1</a>\'}}4(D>2){b+=\'<C 6="3-7 3-16">...</C>\'}1a(5 d=D;d<=E;d++){4(l==d){b+=\'<C 6="3-7 3-1v">\'+d+\'</C>\'}h 4(d==1){4(m==\'3\'){b+=\'<a 6="3-7" 9="\'+y+\'">1</a>\'}h{b+=\'<a 6="3-7" 9="/v/u/\'+w+\'?&i-o=\'+n+\'">1</a>\'}}h{4(m==\'3\'){b+=\'<a 6="3-7" 9="#" z="L(\'+d+\');B x">\'+d+\'</a>\'}h{b+=\'<a 6="3-7" 9="#" z="I(\'+d+\');B x">\'+d+\'</a>\'}}}4(E<j-1){b+=\'<C 6="3-7 3-16">...</C>\'}4(E<j){4(m=="3"){b+=\'<a 6="3-7" 9="#" z="L(\'+j+\');B x">\'+j+\'</a>\'}h{b+=\'<a 6="3-7" 9="#" z="I(\'+j+\');B x">\'+j+\'</a>\'}}5 e=M(l)+1;4(l<j){4(m==\'3\'){b+=\'<a 6="3-7 3-15" 9="#" z="L(\'+e+\');B x"></a>\'}h{b+=\'<a 6="3-7 3-15" 9="#" z="I(\'+e+\');B x"></a>\'}}b+=\'\';5 f=A.1s(\'1t\');5 g=A.1r(\'1A-1D\');1a(5 p=0;p<f.O;p++){f[p].1c=b}4(f&&f.O>0){b=\'\'}4(g){g.1c=b}}G 12(a){5 b=a.1f;5 c=M(b.1E$1B.$t,10);1b(c)}G 1d(){5 a=s;4(a.k(\'/v/u/\')!=-1){4(a.k(\'?T-i\')!=-1){w=a.H(a.k(\'/v/u/\')+14,a.k(\'?T-i\'))}h{w=a.H(a.k(\'/v/u/\')+14,a.k(\'?&i\'))}}4(a.k(\'?q=\')==-1&&a.k(\'.1C\')==-1){4(a.k(\'/v/u/\')==-1){m=\'3\';4(s.k(\'#F=\')!=-1){l=s.H(s.k(\'#F=\')+8,s.O)}h{l=1}A.18(\'<r Q=\\\'\'+y+\'P/R/N?i-o=1&X=Y-S-r&V=12\\\'><\\/r>\')}h{m=\'u\';4(a.k(\'&i-o=\')==-1){n=1F}4(s.k(\'#F=\')!=-1){l=s.H(s.k(\'#F=\')+8,s.O)}h{l=1}A.18(\'<r Q="\'+y+\'P/R/N/-/\'+w+\'?X=Y-S-r&V=12&i-o=1" ><\\/r>\')}}}G L(a){Z=(a-1)*n;K=a;5 b=A.1h(\'1q\')[0];5 c=A.1o(\'r\');c.1e=\'1m/1n\';c.1i(\'Q\',y+\'P/R/N?1j-1k=\'+Z+\'&i-o=1&X=Y-S-r&V=13\');b.1l(c)}G I(a){Z=(a-1)*n;K=a;5 b=A.1h(\'1q\')[0];5 c=A.1o(\'r\');c.1e=\'1m/1n\';c.1i(\'Q\',y+\'P/R/N/-/\'+w+\'?1j-1k=\'+Z+\'&i-o=1&X=Y-S-r&V=13\');b.1l(c)}G 13(a){11=a.1f.1x[0];5 b=11.1g.$t.H(0,19)+11.1g.$t.H(1z,1w);5 c=1y(b);4(m==\'3\'){5 d=\'/v?T-i=\'+c+\'&i-o=\'+n+\'#F=\'+K}h{5 d=\'/v/u/\'+w+\'?T-i=\'+c+\'&i-o=\'+n+\'#F=\'+K}1p.9=d}',62,104,'|||page|if|var|class|num||href||||||||else|max|lastPageNo|indexOf|currentPageNo|currentPage|postResults|results|||script|locationUrl||label|search|postLabel|false|home_page|onclick|document|return|span|pageStart|pageEnd|PageNo|function|substring|getLabelPage|pageNumber|noPage|getPage|parseInt|summary|length|feeds|src|posts|in|updated|prev|callback|numOfPages|alt|json|jsonstart||post|dataFeed|findPostDate||next|dots|pageOf|write||for|startPagination|innerHTML|pageCurrentBlogger|type|feed|published|getElementsByTagName|setAttribute|start|index|appendChild|text|javascript|createElement|location|head|getElementById|getElementsByName|pageArea|of|active|29|entry|encodeURIComponent|23|blog|totalResults|html|pager|openSearch|20'.split('|'),0,{}))
//]]>

<!-- Facebook SDK -->

//<![CDATA[
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
//]]>
