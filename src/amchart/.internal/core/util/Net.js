/**
 * A collection of network-related functions
 */
/**
 * Loads an external file via its URL.
 *
 * Please note that this is an asynchronous function.
 *
 * It will not return the result, but rather a `Promise`.
 *
 * You can use the `await` notion, or `then()`.
 *
 * ```TypeScript
 * // Using await
 * let response = await Net.load( "http://www.my.com/data.json" );
 * console.log( response.response );
 *
 * // Using then()
 * Net.load( "http://www.my.com/data.json" ).then( ( response ) => {
 *   console.log( response.response );
 * } );
 * ```
 * ```JavaScript
 * // Using then()
 * Net.load( "http://www.my.com/data.json" ).then( function( response ) {
 *   console.log( response.response );
 * } );
 * ```
 *
 * @async
 * @see {@link https://www.amcharts.com/docs/v5/concepts/data/net-load-utility/} for more info
 * @param url      URL for the file to load
 * @param target   A target element that is requesting the net load
 * @param options  Request options
 * @return Result (Promise)
 */
export function load(url, target, options) {
    return new Promise((success, error) => {
        // Is return type Blob?
        let isBlob = options != null && options.responseType == "blob";
        // Create request and set up handlers
        let xhr = new XMLHttpRequest();
        xhr.onload = () => {
            if (xhr.status === 200) {
                let response;
                let blob;
                if (isBlob) {
                    blob = xhr.response;
                    readBlob(blob).then((response) => {
                        let output = {
                            xhr: xhr,
                            error: false,
                            response: response,
                            blob: blob,
                            type: xhr.getResponseHeader("Content-Type"),
                            target: target
                        };
                        success(output);
                    });
                    return;
                }
                else {
                    response = xhr.responseText || xhr.response;
                }
                let output = {
                    xhr: xhr,
                    error: false,
                    response: response,
                    blob: blob,
                    type: xhr.getResponseHeader("Content-Type"),
                    target: target
                };
                success(output);
            }
            else {
                error({
                    xhr: xhr,
                    error: true,
                    type: xhr.getResponseHeader("Content-Type"),
                    target: target
                });
            }
        };
        xhr.onerror = () => {
            error({
                xhr: xhr,
                error: true,
                type: xhr.getResponseHeader("Content-Type"),
                target: target
            });
        };
        // Open request
        xhr.open("GET", url, true);
        if (options && options.withCredentials) {
            xhr.withCredentials = true;
        }
        // Process options
        if (options != null) {
            if (options.requestHeaders != null) {
                for (let i = 0; i < options.requestHeaders.length; i++) {
                    let header = options.requestHeaders[i];
                    xhr.setRequestHeader(header.key, header.value);
                }
            }
            if (options.responseType != null) {
                xhr.responseType = options.responseType;
            }
        }
        // Send request
        xhr.send();
    });
}
/**
 * Returns textual representation of a Blob object.
 *
 * @param   blob  Target blob
 * @return        Text promise
 */
export function readBlob(blob) {
    return new Promise((success, error) => {
        const reader = new FileReader();
        reader.onload = _event => {
            success(reader.result);
        };
        reader.onerror = (e) => {
            error(e);
        };
        reader.readAsText(blob);
    });
}
//# sourceMappingURL=Net.js.map