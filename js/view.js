(function(window) {
	class View {
		constructor() {
			this.defaultTemplate = `<div data-id="{{id}}"
      class="task flex items-center rounded px-5 py-3 bg-white w-3/5"
		>
			<label class="round">
				<input type="checkbox" id="checkbox" {{checked}} />
				<span for="checkbox"></span>
			</label>
      <div class="ml-4">
        <h6 class="font-bold">{{title}}</h6>
        <p class="text-sm font-thin text-gray-400">{{date}}</p>
      </div>
     
			<button class="delete text-red-500 ml-auto">
			<i class="delete fa fa-trash fa-2x"></i>
		</button>
		</div>`;

			this.defaultProjectTemplate = `<a data-id={{id}} class="navlink block py-2 pl-8 {{active}} font-normal text-gray-500">
			<i class="fa fa-tasks"></i><span class="ml-5">{{name}}</span></a>`;

			this.defaultSummary = `	<div class="card">
					<p class="text-right mb-3"><i class="fa fa-tasks"></i></p>
					<p class="font-bold text-lg">{{all}}</p>
					<p class="text-sm">All Tasks</p>
				</div>
				<div class="card">
					<p class="text-right mb-3"><i class="fa fa-tasks"></i></p>
					<p class="font-bold text-lg">{{completed}}</p>
					<p class="text-sm">Completed Tasks</p>
				</div>
				<div class="card">
					<p class="text-right mb-3"><i class="fa fa-tasks"></i></p>
					<p class="font-bold text-lg">{{pending}}</p>
					<p class="text-sm">Pending Tasks</p>
				</div>`;
		}

		compile(data) {
			let view = '';
			for (let i = 0; i < data.length; i++) {
				let template = this.defaultTemplate;
				let task = data[i];
				let checked = task.completed ? 'checked' : '';
				template = template.replace('{{id}}', task.id);
				template = template.replace('{{title}}', task.title);
				template = template.replace('{{checked}}', checked);
				template = template.replace(
					'{{date}}',
					new Date(task.date).toDateString()
				);

				view += template;
			}

			return view;
		}

		compileProjects(data, activeId = '') {
			let view = '';
			for (let i = 0; i < data.length; i++) {
				let project = data[i];
				let template = this.defaultProjectTemplate;
				let active = project.id == activeId ? 'active' : '';

				template = template.replace('{{active}}', active);
				template = template.replace('{{name}}', project.name);
				template = template.replace('{{id}}', project.id);
				view += template;
			}

			return view;
		}

		compileTaskCount(data) {
			let allTasks = 0;
			let completed = 0;
			let pending = 0;
			for (let i = 0; i < data.length; i++) {
				for (let j = 0; j < data[i].tasks.length; j++) {
					let task = data[i].tasks[j];
					if (task.completed) completed++;
					else pending++;
					allTasks++;
				}
			}

			let template = this.defaultSummary;
			template = template.replace('{{all}}', allTasks);
			template = template.replace(`{{completed}}`, completed);
			template = template.replace('{{pending}}', pending);

			return template;
		}
	}

	window.app.View = View;
})(window);
