module.exports = toolbox => {
  const { filesystem, print, template: _template } = toolbox;

  async function createRes({name, filename, template, target, props}){
    if(!filesystem.exists(filename)){
      await _template.generate({
        template,
        target,
        props
      })
    } else {
      print.error(`O arquivo /${name}/${filename} já existe`)
    }
  }

  async function isReactNative(){
    const package = await filesystem.read('package.json', 'json');
    return !!package.dependencies['react-native'];
  }

  async function createComponent(folder, { name, lang }){
    if(!name){
      print.error('O nome deve ser informado.')
      return
    }

    const arr = name.split('/')
    const filename = arr[arr.length - 1]

    const type = await isReactNative() ? 'native' : 'web';

    const res = {
      screen: {
        name,
        filename: `src/${folder}/${name}/${filename}.js`,
        template: 'native/screen-prosperita.js.ejs',
        target: `src/${folder}/${name}/${filename}.js`,
        props: { filename }
      },
      style: {
        name,
        filename: `src/${folder}/${name}/styles.${lang}`,
        template: 'native/style-prosperita.js.ejs',
        target: `src/${folder}/${name}/styles.${lang}`,
        props: {}
      },
      index: {
        name,
        filename: `src/${folder}/${name}/index.${lang}`,
        template: 'native/screen-index.js.ejs',
        target: `src/${folder}/${name}/index.${lang}`,
        props: { filename }
      },
    }

    await createRes(res.screen);
    await createRes(res.style);
    await createRes(res.index);

    print.success(`The screen ${filename} was created!`)
  }

  toolbox.createComponentProsperita = createComponent
}
