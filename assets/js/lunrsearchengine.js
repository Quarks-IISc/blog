var idx;
var documents =[];

fetch('/search.json')
  .then(response => response.json())
  .then(data => {
    documents = data;
   
    idx = lunr(function() {
     this.ref('url');
     this.field('title');
     this.field('content');

     documents.forEach(function (doc) {
       this.add(doc);
     }, this);
   });
 });
function lunr_search(term) {
    if (!term || term.trim().length === 0) {
        return false;
    }
    if (!idx){
       alert("Search is still loading...");
       return false;
    }
    $('#lunrsearchresults').show();
    $("body").addClass("modal-open")
    setTimeout(() => {
        document.getElementById('lunrsearch').focus();
    }, 10);
    if(term && term.trim().length >0) {
        document.getElementById('modtit').innerHTML = "<h5 class='modal-title'>Search results for '" + term + "'</h5>";
        //put results on the screen.
        document.querySelector('#lunrsearchresults ul').innerHTML = "";

        var results = idx.search(term);
        if(results.length>0){
            //console.log(idx.search(term));
            //if results
            for (var i = 0; i < results.length; i++) {
                // more statements
                var ref = results[i]['ref'];
                var doc = documents.find(d => d.url === ref);
               
                if (!doc) continue;
            
                
                var url = doc.url;
                var title = doc.title;
                var body = doc.content.substring(0,160)+'...';
                document.querySelector('#lunrsearchresults ul').innerHTML += "<li class='lunrsearchresult'>" +"<a href='" + url + "'>" +"<span class='title'>" + title + "</span><br />" + "<small><span class='body'>"+ body +"</span><br />" +"<span class='url'>"+ url +"</span></small>" + "</a></li>";

            }
        } else {
            document.getElementById('modtit').innerHTML =
"<h5 class='modal-title'>Sorry, no results found. Close & try a different search!</h5>";
        }
    }
    return false;
}

$(function() {
    $(document).on('click' , '.btnx', function () {
        $('#lunrsearchresults').hide( 5 );
        $( "body" ).removeClass( "modal-open" );
    });
});
