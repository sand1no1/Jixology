const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

module.exports = function (plop) {
	// 1. Registramos el nuevo tipo de prompt
	plop.setPrompt('directory', require('inquirer-directory'));

	plop.setGenerator('components', {
		description: 'Generar componente React con bundle de archivos',
		prompts: [
			{
				type: 'directory',
				name: 'destDir',
				message: '¿Dónde quieres guardar el componente?',
				basePath: path.join(process.cwd(), 'src'), // Empieza desde src/
			},
			{
				type: 'input',
				name: 'name',
				message: 'Nombre del componente: '
			},
			{
				type: 'confirm',
				name: 'wantInterface',
				message: '¿Quieres incluir una interfaz al template?',
				default: true
			}
		],

		actions: [
			{
				type: 'addMany',
				// La ruta es src + lo que eligió el usuario (destDir) + nombre del componente
				destination: 'src/{{destDir}}/{{pascalCase name}}',
				base: 'plop-templates/component-bundle',
				templateFiles: 'plop-templates/component-bundle/*.hbs',
			},
			async function openFile(answers) {
				const fileName = plop.getHelper('pascalCase')(answers.name);
				const targetPath = path.join(process.cwd(), 'src', answers.destDir, fileName);
				const fullPath = path.join(targetPath, `${fileName}.tsx`);

				// Espera para asegurar escritura
				await new Promise(resolve => setTimeout(resolve, 300));

				try {
					await execAsync(`code "${fullPath}"`);
					return `Archivo generado en ${targetPath} y abierto en VS Code.`;
				} catch (error) {
					return `Archivo generado, pero no se pudo abrir automáticamente: ${error.message}`;
				}
			}
		]
	});
};