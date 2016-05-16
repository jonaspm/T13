$(document).ready(function () {
	'use strict';

	function crearFila(estudiante) {
		var botonEliminar = $('<button class="btn btn-danger glyphicon glyphicon-trash" aria-hidden="true"></button>'),
			fila = $('<tr><td>' + estudiante.id + '</td><td>' + estudiante.registration_number + '</td><td>' + estudiante.name + '</td><td>' + estudiante.last_name + '</td><td>' + estudiante.status + '</td><td></td></tr>');

		botonEliminar.click(function (event) {
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

		botonEliminar.appendTo(fila.children(':nth-last-child(1)'));

		$('<td><button class="btn btn-success glyphicon glyphicon-pencil" data-toggle="modal" data-target="#nuevoEstudiante" data-is="edit"></button></td>').appendTo(fila);
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

	// Campos del formulario

	var inputs = [$('input[name="mat"]'), $('input[name="nom"]'), $('input[name="ape"]'), $('input[name="est"]')];

	// Modal configuraciones
	var editarId;
	$('#nuevoEstudiante').on('show.bs.modal', function (event) {
		var boton = $(event.relatedTarget) // Boton
  		editarId = boton.data('is');

		if (editarId) {
			var modal = $(this);
			editarId = boton.parent().prevAll(':eq(5)').text();
			inputs[0].val(boton.parent().prevAll(':eq(4)').text());
			inputs[2].val(boton.parent().prevAll(':eq(2)').text());
			inputs[1].val(boton.parent().prevAll(':eq(3)').text());
			inputs[3].val(boton.parent().prevAll(':eq(1)').text());
			modal.find('.modal-title').text('Editar Estudiante #'+editarId);
		}
	});

	// Re iniciar campos del formulario
	$('#cerrar').click(function () {
		$('input').val('');
	});

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
			var url = 'https://andreihelo-restful-api.herokuapp.com/students';
			url += editarId? '/'+editarId : '';
			console.log(url);
			$.ajax(url, {
				method: 'POST',
				data: estudiante,
				dataType: 'json',
				success: function (data, status, xhr) {
					obtenerEstudiantes();
					$('input').val('');
					alert('Éxito!');
				},
				error: function (xhr, status, err) {
					alert('Error: ' + status);
				}
			});

			$('#nuevoEstudiante').modal('toggle');
		}


	});

});
