rm -r js
mkdir js
cd js
mkdir lib
cd ..
cp js_src/background.js  js/background.js
java -jar compiler.jar --js js_src/DbManager.js --js_output_file js/DbManager.js
java -jar compiler.jar --js js_src/FeedViewer.js --js_output_file js/FeedViewer.js
java -jar compiler.jar --js js_src/Globals.js --js_output_file js/Globals.js
java -jar compiler.jar --js js_src/GoogleReader.js --js_output_file js/GoogleReader.js
java -jar compiler.jar --js js_src/popup.js --js_output_file js/popup.js
java -jar compiler.jar --js js_src/ReaderController.js --js_output_file js/ReaderController.js
java -jar compiler.jar --js js_src/ReaderViewer.js --js_output_file js/ReaderViewer.js
java -jar compiler.jar --js js_src/Utils.js --js_output_file js/Utils.js
cp js_src/YoutubeManager.js  js/YoutubeManager.js
java -jar compiler.jar --js js_src/lib/GAPokki.js --js_output_file js/lib/GAPokki.js
java -jar compiler.jar --js js_src/lib/jquery.anythingslider.js --js_output_file js/lib/jquery.anythingslider.js
java -jar compiler.jar --js js_src/lib/jquery.easing.1.3.js --js_output_file js/lib/jquery.easing.1.3.js
java -jar compiler.jar --js js_src/lib/LocalStore.js --js_output_file js/lib/LocalStore.js
java -jar compiler.jar --js js_src/lib/PokkiBrowser.js --js_output_file js/lib/PokkiBrowser.js
java -jar compiler.jar --js js_src/lib/SmoothScroll.js --js_output_file js/lib/SmoothScroll.js
cp js_src/lib/jquery.min.js js/lib/jquery.min.js
cp js_src/lib/jQuery.jQTubeUtil.js js/lib/jQuery.jQTubeUtil.js