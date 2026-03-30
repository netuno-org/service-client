if (_req.getString('name') === 'Test Name' && _req.getBoolean('test')) {
  _out.json({result: true})
} else {
  _header.status(400)
  _out.json({error: "invalid-parameters"})
}

