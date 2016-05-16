$(document).ready(function () {
	'use strict';

	function crearFila(estudiante) {
		var boton = $('<button class="btn btn-danger glyphicon glyphicon-trash" aria-hidden="true"></button>'),
			fila = $('<tr><td>' + estudiante.id + '</td><td>' + estudiante.registration_number + '</td><td>' + estudiante.name + '</td><td>' + estudiante.last_name + '</td><td>' + estudiante.status + '</td><td></td></tr>');

		boton.click(function (event) {
			var self = this, id = $(this).parent().parent().children(':nth-child(1)').text();

			$.ajax('https://andreihelo-restful-api.herokuapp.com/students/' + id, {
				method: 'POST',
				dataType: 'json',
				data: '_method=DELETE',
				success: function (data, status, xhr) {
					$(self).parent().parent().remove();
				},
				error: function (xhr, status, err) {
					alert('Error: ' + status);
				}
			});
		});

		boton.appendTo(fila.children(':nth-last-child(1)'));
		fila.appendTo($('tbody'));
	}

	function obtenerEstudiantes() {
		$.ajax('https://andreihelo-restful-api.herokuapp.com/students', {
			method: 'GET',
			dataType: 'json',
			ifModified: true,
			success: function (data, status, xhr) {

				$('tbody').html('');
				$.each(data, function (index, estudiante) {

					crearFila(estudiante);
				});
			}
		});
	}

	// Obtener lista de estudiantes

	$('#mostrar').click(function (event) {

		obtenerEstudiantes();
	});

	// Re iniciar campos del formulario
	$('#cerrar').click(function () {
		$('input').val('');
	});

	// Campos del formulario

	var inputs = [$('input[name="mat"]'), $('input[name="nom"]'), $('input[name="ape"]'), $('input[name="est"]')];

	// Comportamiento del formulario

	$('#crear').click(function (event) {

		// Validar el formulario
		var valid = true;

		$.each(inputs, function (index, control) {
				if (!control.val()) {
					control.parent().addClass('has-error');
					control.next('small').css('display', 'inline');
					valid = false;
				} else {
					control.parent().removeClass('has-error');
					control.next('small').css('display', 'none');
				}
			}
		);

		if (valid) {
			// Crear el objeto estudiante y asignar propiedades
			var estudiante = {};
			estudiante.registration_number = inputs[0].val();
			estudiante.name = inputs[1].val();
			estudiante.last_name = inputs[2].val();
			estudiante.status = inputs[3].val();

			// Realizar el envío de los datos
			$.ajax('https://andreihelo-restful-api.herokuapp.com/students', {
				method: 'POST',
				data: estudiante,
				dataType: 'json',
				success: function (data, status, xhr) {
					obtenerEstudiantes();
					$('input').val('');
					alert('Estudiante creado!');
				},
				error: function (xhr, status, err) {
					alert('Error: ' + status);
				}
			});

			$('#nuevoEstudiante').modal('toggle');
		}


	});

});
