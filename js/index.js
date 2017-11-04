/*
  Creación de una función personalizada para jQuery que detecta cuando se detiene el scroll en la página
*/
/*$.fn.scrollEnd = function(callback, timeout) {
  $(this).scroll(function(){
    var $this = $(this);
    if ($this.data('scrollTimeout')) {
      clearTimeout($this.data('scrollTimeout'));
    }
    $this.data('scrollTimeout', setTimeout(callback,timeout));
  });
};*/

/*
  Función que inicializa el elemento Slider
*/
function inicializarSlider(){
  $("#rangoPrecio").ionRangeSlider({
    type: "double",
    grid: false,
    min: 0,
    max: 100000,
    from: 200,
    to: 80000,
    prefix: "$"
  });
}

/*
  Función que reproduce el video de fondo al hacer scroll, y deteiene la reproducción al detener el scroll
*/
function playVideoOnScroll(){
  var ultimoScroll = 0,
      intervalRewind;
  var video = document.getElementById('vidFondo');
  $(window)
    .scroll((event)=>{
      var scrollActual = $(window).scrollTop();
      if (scrollActual > ultimoScroll){
       video.play();
     } else {
        //this.rewind(1.0, video, intervalRewind);
        video.play();
     }
     ultimoScroll = scrollActual;
    })
    .scrollEnd(()=>{
      video.pause();
    }, 10)
}

inicializarSlider();
// playVideoOnScroll();

$(document).ready(function(){

  $('#submitButton').click(function(){
    var filters = {};
    var range = [0,0];

    if( $('#selectCiudad').val() ){
      filters.Ciudad = $('#selectCiudad').val();
    }
    if( $('#selectTipo').val() ){
      filters.Tipo = $('#selectTipo').val();
    }
    if( $('#rangoPrecio').val() ){
      range = $('#rangoPrecio').val().split(';');
    }
    

    var filteredList  = _.where( JSON.parse(localStorage.getItem('all_data')) , filters );
    $('#results').html('');
    $.each( filteredList ,function(key,item){
        if( range[0] != 0 && range[1] != 0 ){
          var clean_price = item.Precio.replace('$','');
          clean_price = clean_price.replace(',','');
          clean_price = clean_price.replace(',','');

          if( clean_price > range[0] && clean_price < range[1] ){
            $('#results').append(`
              <div class="card">
                <div class="card-content">
                  <span class="card-title">`+item.Direccion+`</span>
                  <p><i class="Small material-icons">insert_chart</i> : `+item.Ciudad+`</p><hr>
                  <p><i class="Small material-icons">contact_phone</i> : `+item.Telefono+`</p><hr>
                  <p><i class="Small material-icons">map</i> : `+item.Codigo_Postal+`</p><hr>
                  <p><i class="Small material-icons">insert_chart</i> : `+item.Tipo+`</p><hr>
                  <p><i class="Small material-icons">attach_money</i> : `+item.Precio+`</p>
                </div>
              </div>
            `);
          }
        }else{
          $('#results').append(`
            <div class="card">
              <div class="card-content">
                <span class="card-title">`+item.Direccion+`</span>
                <p><i class="Small material-icons">insert_chart</i> : `+item.Ciudad+`</p><hr>
                <p><i class="Small material-icons">contact_phone</i> : `+item.Telefono+`</p><hr>
                <p><i class="Small material-icons">map</i> : `+item.Codigo_Postal+`</p><hr>
                <p><i class="Small material-icons">insert_chart</i> : `+item.Tipo+`</p><hr>
                <p><i class="Small material-icons">attach_money</i> : `+item.Precio+`</p>
              </div>
            </div>
          `);
        }
    });
  });

  $('#mostrarTodos').click(function(){
    $('#results').html('');
    if( localStorage.getItem('all_data') ){
      $.each( JSON.parse(localStorage.getItem('all_data')) ,function(key,item){
          $('#results').append(`
            <div class="card">
              <div class="card-content">
                <span class="card-title">`+item.Direccion+`</span>
                <p><i class="Small material-icons">insert_chart</i> : `+item.Ciudad+`</p><hr>
                <p><i class="Small material-icons">contact_phone</i> : `+item.Telefono+`</p><hr>
                <p><i class="Small material-icons">map</i> : `+item.Codigo_Postal+`</p><hr>
                <p><i class="Small material-icons">insert_chart</i> : `+item.Tipo+`</p><hr>
                <p><i class="Small material-icons">attach_money</i> : `+item.Precio+`</p>
              </div>
            </div>
          `);
      });
    }else{
      $.ajax({
        url : 'data-1.json',
        dataType : 'JSON',
        success:function( data ){

        }
      });
    }
  });

  $.ajax({
    url : 'data-1.json',
    dataType : 'JSON',
    success:function( data ){
      localStorage.setItem('all_data',JSON.stringify(data) );

      var cities = _.groupBy(data, "Ciudad");
      $.each(cities,function(key,item){
          $('#selectCiudad').append($('<option>', {
              value: key,
              text: key
          }));
      });

      var types = _.groupBy(data, "Tipo");
      $.each(types,function(key,item){
          $('#selectTipo').append($('<option>', {
              value: key,
              text: key
          }));
      });


    }
  });

  setTimeout(function(){
    $('select').material_select();
  },1000);
});