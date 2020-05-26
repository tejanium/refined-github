import optionsStorage from '../options-storage';
import select from 'select-dom';
import features from '.';

(async () => {
	const options = await optionsStorage.getAll();

	eval.call(null, options.customScript);

	features.add({
		id: __filebasename,
		description: 'Custom script',
		screenshot: ''
	},
		{
			init
		}
	);
})();
