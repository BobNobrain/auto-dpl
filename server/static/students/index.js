window.addEventListener('load', function ()
{
	window.el = {
		tbody: elId('data_tbody'),
		$btn: $('#add_btn'),
		$modal: $('#modal_add')
	};

	window.cache = [];
	window.related = {
		name: 'group',
		field: 'group_id'
	};
	window.schema = 'student_id surname name third_name birthday passport_number snils sex group_id'.split(' ');
	loadData();

	el.$btn.on('click', function ()
	{
		el.$modal.modal('toggle');
	});
});

function loadData()
{
	window.cache = [];
	xhr('GET', '/api/student')
		.done(function (result)
		{
			window.el.tbody.innerHTML = '';
			appendContent(window.el.tbody, result.map(function (entity)
			{
				return new Row(entity).render();
			}));
		})
		.fail(function (code)
		{
			if (code === 0) alert('Server unavailable');
			else alert(code.message);
		})
}

function loadRelatedObject()
{

}

function Row(data)
{
	this.data = data;
	this.relatedEl = null;
}
Row.prototype.render = function ()
{
	var values = [];
	for (var i = 1; i < window.schema.length; i++)
	{
		var v = this.data[window.schema[i]];
		if (schema[i] === 'birthday') v = new Date(v).toLocaleDateString();
		if (v === null) v = '&mdash;';
		values.push(v);
	}
	return dom(
		'tr', {},
		values.map(function (v)
		{
			return dom('td', {}, v + '');
		})
	);
};
