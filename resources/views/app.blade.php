<!DOCTYPE html>
<html>

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="{{ asset('css/app.css') }}" type="text/css">
    <link rel="stylesheet" href="{{ asset('css/main.css') }}" type="text/css">

    <title>c-SPOT-ify</title>

    <link href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' rel="stylesheet" type="text/css">

    <script>
      window.cspot2_server_data = "{!! addslashes(json_encode($data)) !!}"
      window.csrf_token = "{{ csrf_token() }}"
    </script>
  </head>

  <body>

    <div id="app"></div>

    <script src="{{ asset('js/main.js') }}"></script>
  </body>

</html>
