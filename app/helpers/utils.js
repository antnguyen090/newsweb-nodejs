
let createFilterStatus =  async (currentStatus, collection) => {
	let ItemsModel = require(__path_schemas_backend +  collection);
    let statusFilter = [
		{name: 'All', value: 'all', count: 0, class: 'default'},
		{name: 'Active', value: 'active',  count: 0, class: 'default'},
		{name: 'InActive', value: 'inactive',  count: 0, class: 'default'}
	];

	for(let index = 0; index < statusFilter.length; index++) {
		let item = statusFilter[index];
		let condition = (item.value !== "all") ? {status: item.value} : {};
		statusFilter[index].class = 'primary';
		if(item.value === "active") {
			statusFilter[index].class = 'success';
		} else if(item.value === "inactive") {
			statusFilter[index].class = 'danger';
		}
		await ItemsModel.count(condition).then( (data) => {
			statusFilter[index].count = data;
		});
	}

    return statusFilter;
}

module.exports = {
    createFilterStatus: createFilterStatus
}