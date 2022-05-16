const image = _req.getFile('image')
if (_req.getString('name') == 'Test Name' && _req.getBoolean('test') && image) {
  _out.json({result: true})
} else {
  _header.status(500)
}

