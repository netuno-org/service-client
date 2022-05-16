
_header.contentTypePNG().noCache()

_out.copy(
  _app.file('public/images/logo.png')
    .inputStream()
)
