;(function(){
	var timer = -1;
	
	function logoAinmation(){
		timer && clearTimeout(timer);
		
		var logo = $('.logo');
		logo.css({transform:'scale(0.6,0.6) rotate(50deg)',transition:'all 0.6s ease-out',opacity:0});
		timer = setTimeout(function(){
			logo.css({transform:'scale(1,1) rotate(0deg)',opacity:1});
		},500);
	};
	
	this.$APP = {
		logoAinmation: logoAinmation
	};
})();

$(document).ready(function() {
    //到页首
    $().UItoTop({ easingType: 'easeOutQuart' });
	
	$APP.logoAinmation();
});