const fs = require('fs'); let css = fs.readFileSync('src/app.css', 'utf8'); css = css.replace(/:global\((.*?)\)/g, (m, p1) => p1); fs.writeFileSync('src/app.css', css);
