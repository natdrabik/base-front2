export function Ajax(callback, options={}) {
  return function(event) {

    if (!event.defaultPrevented) event.preventDefault();

    const method = options.method || this._form.getAttribute('method') || 'POST';
    let action = options.action || this._form.getAttribute('action') || location.pathname;
    let params = options.form instanceof FormData ? options.form : new FormData(options.form || this._form || this);

    // console.log(options.appendData)

    if (options.appendData) {
      options.appendData.forEach((param) => {
        params.append(param.name, param.value);
      })
    }

    // for (let pair of params.entries()) {
    //   console.log(pair[0]+ ', ' + pair[1]);
    // }

    const req = new XMLHttpRequest();
    req.open(method, action, true);

    req.onload = () => {
      if (req.status >= 200 && req.status < 400) {

        const content = JSON.parse(req.responseText);
        if(callback) return callback.call(this, false, content);
      } else {
        if(callback) return callback.call(this, true, 'We reached our target server, but it returned an error');
      }
    }

    req.onerror = () => {
      if(callback) return callback.call(this, true, 'There was a connection error of some sort');
    }

    req.send(params);
  }

}