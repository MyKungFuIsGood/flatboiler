<!-- cdn plugins with fallbacks -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script>if (!window.jQuery) { document.write('<script src="/assets/js/plugins/jquery.min.js"><\/script>'); }</script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.4/js/bootstrap.min.js"></script>
<script>$.fn.modal || document.write('<script src="/assets/js/plugins/bootstrap.min.js"><\/script>')</script>

<!-- our javascript -->
<script src="assets/js/main.js?v=8"></script>

<!-- livereload for *.local* -->
<script>
( location.host.split('.').pop().indexOf('local') ) || document.write('<script src="http://localhost:35729/livereload.js"><\/script>')
</script>