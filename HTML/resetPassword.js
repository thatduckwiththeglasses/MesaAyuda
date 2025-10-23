const form = document.querySelector('.form');



/*---
    Intercepta el submit del formulario
    */

form.addEventListener('submit', (event) => {
	event.preventDefault();
	const formData = new FormData(form);
	const data = Object.fromEntries(formData);

	if (data.contacto === '' || data.password === '') {
		mostrarError('Debe completar todos los campos');
		return;
	}

	if (data.password == ' ') {
		mostrarError('Las contraseñas no pueden estar vacias');
		return;
	}

	if (data.password !== data.confirmPassword) {
		mostrarError('Las contraseñas no coinciden');
		return;
	}

	const HTMLResponse = document.querySelector('#app');
	const ul = document.createElement('ul');

	const tpl = document.createDocumentFragment();

	/* se guardan links en constantes para saltar de una pagina a otra */
    const systemURL = {
		loginCliente: 'http://127.0.0.1:5500/HTML/loginClient.html',
		resetPassword: 'http://127.0.0.1:5500/HTML/resetPassword.html',
	};

    /* se guardan las llamadas a las funciones en mesaayuda.js */
	const RESTAPI = {
		loginCliente: 'http://localhost:8080/api/loginCliente',
        resetPassword: 'http://localhost:8080/api/resetCliente',
	};

/*-----
    Define el URI para realizar el acceso en base al acceso a un servidor local
*/
    const MODE='LOCAL'; /*-- Instrucción a cambiar opciones LOCAL, TYPICODE o AWS --*/

	if (MODE == 'LOCAL') {
	/*-----
        Crea estructuras para acceder a data del cliente
        */
	    const updatePass = {
            contacto: data.contacto,
		    password: data.password,
		}	

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatePass),
	};



	 	console.log('API REST:' + RESTAPI.resetPassword);
		console.log('reseteando: '+ JSON.stringify(updatePass.contacto));
	    console.log('options ' + JSON.stringify(options.method) + ' , ' + JSON.stringify(options.headers)+ 'se enviando las constraseñas ');
    	var API = RESTAPI.resetPassword;
	    var APIoptions = options;

	};


	/*----------------------------------------------------------------------*/
	/*---- Typicode utilizar id 803a62c8-78c8-4b63-9106-73af216d504b -------*/
	/*                                                                      */
	/* El siguiente código es utilizado para resolver la validación de      */
	/* cliente utilizando un "fake" API REST server en Typicode             */
	/* para realizar la validación con el REST API server correcto          */
	/* deberá cambiar la instrucción para que                               */
	/*              const tipycode=false;                                   */
	/*----------------------------------------------------------------------*/


	if (MODE == 'TYPICODE') {
		console.log('Acceso usando Typicode como application server');
		API =
			'https://my-json-server.typicode.com/lu7did/MesaAyuda/posts/' + data.id;
		APIoptions = { method: 'POST' };
	}

	/*----------------------------------------------------------------------*/
	/*---- AWS Accede con URL de Lambda loginUserGET                 -------*/
	/*                                                                      */
	/* cliente: 803a62c8-78c8-4b63-9106-73af216d504b                        */
	/*                                                                      */
	/* Para activar el acceso mediante AWS hacer const aws=true;            */
	/*----------------------------------------------------------------------*/
	if (MODE == 'AWS') {
		console.log('Acceso usando AWS lambda como application server');
		API='https://fmtj0jrpp9.execute-api.us-east-1.amazonaws.com/default/loginUserGET?ID=' + data.id + '&PASSWORD=' + data.password;
    	APIoptions = { method: 'POST' };
	}
	/*-----
    Realiza el acceso al API Rest utilizando gestión de sincronización mediante promesas
	utiliza URL y options definidos en los pasos anteriores
    */

	fetch(`${API}`, APIoptions)
		.then((res) => res.json())
		.then((datos) => {
			if (datos.response === 'OK') {
				mostrarExito('Cambio exitoso');
                function mostrarExito(mensaje) {
		            const elementoResultado = document.getElementById('resultado1');
		            elementoResultado.style.color = 'green';
		            elementoResultado.textContent = mensaje;
	            }
				// Redirigir después de éxito
			} else {
				mostrarError(datos.message);
                function mostrarError(mensaje) {
		            const elementoResultado = document.getElementById('resultado1');
		            elementoResultado.style.color = 'red';
		            elementoResultado.textContent = mensaje;
                }
			}
		});


	// Lógica del formulario aquí
});

