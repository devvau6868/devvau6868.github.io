$(document).ready(function () {

    'use strict';
    
    /* =======================
    Simple Search Settings
    ======================= */
    SimpleJekyllSearch({
      searchInput: document.getElementById('js-search-input'),
      resultsContainer: document.getElementById('js-results-container'),
      json: '/search.json',
      searchResultTemplate: '<li><a href="{url}">• {title}</a></li>',
      noResultsText: '<li>Không tìm thấy bài viết</li>'
    })

    /* =======================
    Scroll to top
    ======================= */
  
    $('.c-top').click(function () {
        $('html, body').stop().animate({ scrollTop: 0 }, 'slow', 'swing');
      });
      $(window).scroll(function () {
        if ($(this).scrollTop() > $(window).height()) {
          $('.c-top').addClass("c-top--active");
        } else {
          $('.c-top').removeClass("c-top--active");
        };
      });
    
    


    /* =======================
    Progress
    ======================= */
  
  window.onscroll = function() {myFunction()};
  
  function myFunction() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
  }
    });