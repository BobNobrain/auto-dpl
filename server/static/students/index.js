window.addEventListener('load', function ()
{
	window.el = {
		tbody: elId('data_tbody'),
		$btn: $('#add_btn'),
		$modal: $('#modal_add'),
		$submit: $('#submit_btn')
	};
	// el.$modal.modal();

	window.related = {
		name: 'group',
		field: 'group_id',
		adds: ['group_number'],
		entity: '/api/group'
	};
	window.schema = 'student_id surname name third_name birthday passport_number snils sex group_id'.split(' ');

	window.entity = '/api/student';

	window.displaySchema = schema.slice().concat(related.adds);
	window.displaySchema.splice(window.displaySchema.indexOf(related.field), 1);
	loadData();

	el.$btn.on('click', function ()
	{
		window.editMode = 'add';
		el.$modal.modal('toggle');
	});

	el.$submit.on('click', function ()
	{
		if (!validateInputs()) return;
		var data = {};
		for (var i = 1; i < window.schema.length; i++)
		{
			data[schema[i]] = $('#' + schema[i]).val();
			if (isFieldDate(schema[i]))
				data[schema[i]] = cvtDate(data[schema[i]]);
		}
		console.log(data);
		if (window.editMode === 'add')
			addRecord(data);
		else
			editRecord(window.editId, data);
		el.$modal.modal('hide');
	});

	for (var i = 0; i < window.schema.length; i++)
	{
		$('#' + schema[i]).on('change', function ()
		{
			validateInput($(this));
		});
	}

	window.editMode = 'none';
	window.editId = -1;

	getRelated();
});

function loadData()
{
	xhr('GET', window.entity)
		.done(function (result)
		{
			window.el.tbody.innerHTML = '';
			appendContent(window.el.tbody, result.map(function (entity)
			{
				return new Row(entity).render();
			}));
			window.data = result;
		})
		.fail(function (code)
		{
			if (code === 0) alert('Server unavailable');
			else alert(code.message);
		})
	;
}

function validateInputs()
{
	var els = {};
	for (var i = 1; i < window.schema.length; i++)
	{
		var el = els[schema[i]] = $('#' + schema[i]);
		console.log(schema[i], el);
		if (!validateInput(el))
			return false;
	}
	return true;
}
function validateInput(el)
{
	var val = el.val();
	markValid(el[0]);
	if (val === '' && el.attr('required'))
	{
		invalidate(el[0], 'Заполните это поле');
		return false;
	}
	switch (el.attr('id'))
	{
		case 'passport_number':
			if (!val.match(/[0-9]{10}/))
			{
				invalidate(el[0], 'Некорректный номер паспорта');
				return false;
			}
			else
			{
				markValid(el[0]);
				return true;
			}
			break;
		case 'snils':
			if (!val.match(/[0-9]{11}/))
			{
				invalidate(el[0], 'Некорректный номер СНИЛС');
				return false;
			}
			else
			{
				markValid(el[0]);
				return true;
			}
			break;
	}
	return true;
}
function invalidate(el, msg)
{
	el.setCustomValidity(msg);
}
function markValid(el)
{
	el.setCustomValidity('');
}

function Row(data)
{
	// delete data[window.related.field];
	this.data = data;
	this.relatedEl = null;
}
Row.prototype.render = function ()
{
	var values = [];
	for (var i = 1; i < window.displaySchema.length; i++)
	{
		var v = this.data[window.displaySchema[i]];
		if (isFieldDate(displaySchema[i])) v = new Date(v).toLocaleDateString();
		if (v === null) v = '&mdash;';
		values.push(v);
	}

	values.push('<button type="button" class="btn btn-primary" onclick="startEditing(this);">Редактировать</button>' +
		'<button type="button" class="btn btn-danger" onclick="deleteRecord(this);">Удалить</button>');

	return dom(
		'tr', { 'data-id': this.data[window.schema[0]] },
		values.map(function (v)
		{
			return dom('td', {}, v + '');
		})
	);
};

function getRelated()
{
	xhr('GET', window.related.entity)
		.done(function (groups)
		{
			var select = elId(window.related.field);
			select.innerHTML = '';
			appendContent(select, groups.map(function (group)
			{
				return dom('option', { value: group.group_id }, group.group_number);
			}));
		})
		.fail(function (code)
		{
			if (code === 0) alert('Server unavailable');
			else alert(code.message);
		})
	;
}

function addRecord(data)
{
	xhr('POST', window.entity, data)
		.done(function (result)
		{
			console.log(result);
			loadData();
			alert('Добавлено');
		})
		.fail(function (code)
		{
			if (code === 0) alert('Server unavailable');
			else alert(code.message);
		})
	;
}

function deleteRecord(el)
{
	var $tr = $(el).closest('tr');
	var id = +$tr.attr('data-id');
	if (!confirm('Вы действительно хотите удалить эту запись?')) return;
	xhr('DELETE', window.entity + '/' + id)
		.done(function ()
		{
			$tr.remove();
		})
		.fail(function (code)
		{
			if (code === 0) alert('Server unavailable');
			else alert(code.message);
		})
	;
}

function editRecord(id, data)
{
	xhr('POST', window.entity + '/' + id, data)
		.done(function (result)
		{
			alert('Запись успешно обновлена');
			loadData();
		})
		.fail(function (code)
		{
			if (code === 0) alert('Server unavailable');
			else alert(code.message);
		})
	;
}

function startEditing(el)
{
	window.editMode = 'edit';
	window.editId = +$(el).closest('tr').attr('data-id');

	for (var i = 0; i < window.data.length; i++)
	{
		if (window.data[i][window.schema[0]] === window.editId)
		{
			var record = window.data[i];
			for (var j = 1; j < window.schema.length; j++)
			{
				var val = record[schema[j]];
				if (isFieldDate(schema[j]))
					val = new Date(val).toLocaleDateString();
				$('#' + schema[j]).val(val);
			}
			break;
		}
	}

	window.el.$modal.modal('show');
}

function isFieldDate(f)
{
	return f === 'birthday'
		|| f === 'begin_date'
		|| f === 'end_date'
		|| f === 'produced_at';
}

function cvtDate(s)
{
	return s.split('.').reverse().join('-');
}
