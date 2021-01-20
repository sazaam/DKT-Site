var NOISE_SETTINGS = 0 ;
var noiseVS = ` void main() {
  gl_Position = vec4( position, 1.0 );
}`
var noiseFS = `// By Liam Egan
// 2018

uniform vec2 u_resolution;
uniform float u_time;

const int octaves = 6;
const float seed = 43758.5453123;
const float seed2 = 73156.8473192;

vec2 random2(vec2 st, float seed){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*seed);
}

float noise(vec2 st, float seed) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0), seed ), f - vec2(0.0,0.0) ), 
                    dot( random2(i + vec2(1.0,0.0), seed ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0), seed ), f - vec2(0.0,1.0) ), 
                    dot( random2(i + vec2(1.0,1.0), seed ), f - vec2(1.0,1.0) ), u.x), u.y);
}

float fbm1(in vec2 _st, float seed) {
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100.0);
  // Rotate to reduce axial bias
  mat2 rot = mat2(cos(0.5), sin(0.5),
                  -sin(0.5), cos(0.50));
  for (int i = 0; i < octaves; ++i) {
      v += a * noise(_st, seed);
      _st = rot * _st * 2.0 + shift;
      a *= 0.4;
  }
  return v;
}

float pattern(vec2 uv, float seed, float time, inout vec2 q, inout vec2 r) {

  q = vec2( fbm1( uv + vec2(0.0,0.0), seed ),
                fbm1( uv + vec2(5.2,1.3), seed ) );

  r = vec2( fbm1( uv + 4.0*q + vec2(1.7 - time / 2.,9.2), seed ),
                fbm1( uv + 4.0*q + vec2(8.3 - time / 2.,2.8), seed ) );

  vec2 s = vec2( fbm1( uv + 4.0*r + vec2(21.7 - time / 2.,90.2), seed ),
                fbm1( uv + 4.0*r + vec2(80.3 - time / 2.,20.8), seed ) );

  vec2 t = vec2( fbm1( uv + 4.0*s + vec2(121.7 - time / 2.,90.2), seed ),
                fbm1( uv + 4.0*s + vec2(180.3 - time / 2.,20.8), seed ) );

  float rtn = fbm1( uv + 4.0*t, seed );

rtn = clamp(rtn, 0., .5); // This shit is magic!

  return rtn;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
  uv *= 1. + dot(uv, uv)*.3;

  
  float time = u_time / 40.;
  float timeRot = time / 5. ;
  mat2 rot = mat2(cos(timeRot), sin(timeRot),
                  -sin(timeRot), cos(timeRot));
  uv = rot * uv;
  uv *= 1.4 + sin(time) * .3;
  uv.x -= time;
  
  vec2 q = vec2(0.,0.);
  vec2 r = vec2(0.,0.);
  
  vec3 colour = vec3(pattern(uv, seed, time, q, r));
  float QR = clamp(dot(q, r), -1., 1.);
  colour += vec3(
    (q.x + q.y) + QR * 50., 
    // QR * 15., 
    QR * 5., 
    // r.x * r.y + QR * 5.
    0.
  );
  colour += .1;
  colour = clamp(colour, 0.15, 1.);

  gl_FragColor = vec4(colour + (abs(colour) * .5), 1.);
}` ;

var noise = {
  settings:{},
  enable:function(cond, canvascontainer){
    
    var camera, scene, renderer;
    var uniforms;
    var onWRNoise, animNoise, renderNoise ; 
    var animTW ;
    if(cond){

      if(!NOISE_SETTINGS){
        camera = new THREE.Camera() ;
        camera.position.z = 1 ;

        scene = new THREE.Scene() ;

        var geometry = new THREE.PlaneBufferGeometry( 2, 2 ) ;
        var uu = 10 ;
        uniforms = {
          u_time: { type: "f", value:uu + 1.0 },
          u_resolution: { type: "v2", value: new THREE.Vector2() },
          u_mouse: { type: "v2", value: new THREE.Vector2() }
        };

        var material = new THREE.ShaderMaterial( {
          uniforms: uniforms,
          vertexShader:noiseVS,
          fragmentShader: noiseFS
        } );

        var mesh = new THREE.Mesh( geometry, material ) ;
        scene.add( mesh ) ;

        renderer = new THREE.WebGLRenderer() ;
        renderer.setPixelRatio( window.devicePixelRatio ) ;
        canvascontainer.append( renderer.domElement ) ;

        NOISE_SETTINGS = 1 ;

        onWRNoise = noise.settings.onWRNoise = function( event ) {
          var ww = canvascontainer.width() ;
          var hh = canvascontainer.height() ;
          renderer.setSize( ww, hh );
          uniforms.u_resolution.value.x = renderer.domElement.width;
          uniforms.u_resolution.value.y = renderer.domElement.height;
        }
        

        // animNoise = noise.settings.animNoise = function() {
        //   noise.settings.NOISEID = requestAnimationFrame( animNoise );
        //   renderNoise();
        // }
        renderNoise = noise.settings.renderNoise = function() {
          uniforms.u_time.value += 0.05 ;
          renderer.render( scene, camera );
        } ;
        ANIM_TW = noise.settings.ANIM_TW = new BJS.$.Animation(undefined, renderNoise) ; 
        
      }else{
        onWRNoise = noise.settings.onWRNoise ;
        renderNoise = noise.settings.renderNoise ;
        ANIM_TW = noise.settings.ANIM_TW ;
      }
      
      window.addEventListener( 'resize', onWRNoise, false ) ;
      onWRNoise();
      
      ANIM_TW.start() ;
    }else{
      
      onWRNoise = noise.settings.onWRNoise
      renderNoise = noise.settings.renderNoise ;
      ANIM_TW = noise.settings.ANIM_TW ;


      ANIM_TW.halt() ;
      
      window.removeEventListener( 'resize', onWRNoise, false ) ;
      
    }
    


    


  }
} ;

var viz3D = {
  settings:{},
  enable:function(cond, canvascontainer, e){
    
    var res = e.target ;

    if(cond){
      

      if(!res.userData.ID){
        
      
      var orbitControls;
      var camera, scene, renderer, loader;
      var gltf, background, envMap, mixer, extensionControls;

      // HDR SETTINGS
      const HDRIntensity = 2 ;
      const hdr = 'venice_sunset_1k.hdr' ;
      // const hdr = 'autoshop_01_1k.hdr' ;
      // var showEnvMap = true ;
      var showEnvMap = false ;
      

      //COMPOSITING
      var composer, effect ;

      const clock = new THREE.Clock();

      const scenes = {
        Machine: {
          name: 'DKT Machine (MicroGravure)',
          // url: '/obj/gltf/UV.glb',
          url: '/model/microgravure.glb',
          // url: '/model/untitled.gltf',
          // url: '/model/microgravure-cleaner.gltf',
          // noMetals:true,
          author: 'Sazaam',
          authorURL: 'https://www.sazaam.net/',
          cameraPosition: new THREE.Vector3( 0.02,0, 4 ),
          // objectRotation: new THREE.Euler( 0, Math.PI / 2, 0 ),
          objectRotation: new THREE.Euler( 0, Math.PI, 0 ),
          objectPosition: new THREE.Vector3( 0, -1.2, 0 ),
          addLights:true,
          // addShadows:true,
          // addGround:true,
          // groundPosition: new THREE.Vector3( 0, -1.04, 0 ),
          // objectRotation: new THREE.Euler( 0, Math.PI, 0 ),
          addEnvMap: true
        }
      };


      const state = {
        scene: 'Machine'
      };

      function onload() {

        sceneInfo = scenes[ state.scene ] ;
        
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        
        renderer.setSize( canvascontainer.width(), canvascontainer.height() );
        // renderer.setClearColor(0xDDDDDD, 1);
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        renderer.physicallyCorrectLights = true;
        canvascontainer.append( renderer.domElement );

        window.addEventListener( 'resize', onWindowResize, false );

        // Load background and generate envMap

        if(sceneInfo.addEnvMap){
          new THREE.RGBELoader()
            .setDataType( THREE.UnsignedByteType )
            .setPath( '/hdr/' )
            .load( hdr, function ( texture ) {

              envMap = pmremGenerator.fromEquirectangular( texture ).texture ;
              pmremGenerator.dispose() ;

              if(showEnvMap) background = envMap ;

              //
              
              initScene( scenes[ state.scene ] );
              animate();

            } );
          
          const pmremGenerator = new THREE.PMREMGenerator( renderer );
          pmremGenerator.compileEquirectangularShader();
        }else{
          initScene( sceneInfo ) ;
          animate() ;
        }

        

      }
      
      function initScene( sceneInfo ) {
        
        scene = new THREE.Scene() ;
        scene.background = new THREE.Color( 0xe3dcd5 ) ;

        camera = new THREE.PerspectiveCamera( 45, canvascontainer.width() / canvascontainer.height(), 0.001, 1000 ) ;
        scene.add( camera ) ;

        var spot1 ;
        var ground ;


        if ( sceneInfo.addLights ) {

          spot1 = new THREE.SpotLight( 0xffffff, 1 );
          spot1.position.set( 5, 10, 5 );
          spot1.angle = 0.50;
          spot1.penumbra = 0.75;
          spot1.intensity = 100;
          spot1.decay = 1.3;
          
          
          if ( sceneInfo.addShadows ) {

            spot1.castShadow = true;
            spot1.shadow.bias = 0.0001;
            spot1.shadow.mapSize.width = 2048;
            spot1.shadow.mapSize.height = 2048;

          }

          scene.add( spot1 );
        }

        if ( sceneInfo.addShadows ) {

          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        }

        // TODO: Reuse existing OrbitControls, GLTFLoaders, and so on

        orbitControls = new THREE.TrackballControls( camera, renderer.domElement ) ;

        if ( sceneInfo.addGround ) {

          ground = new THREE.Mesh( 
              new THREE.PlaneBufferGeometry( 2048, 2048 ), 
              new THREE.MeshStandardMaterial( { color: 0xaaaaaa } )
          ) ;
          ground.receiveShadow = !! sceneInfo.addShadows;

          if ( sceneInfo.groundPosition ) {

            ground.position.copy( sceneInfo.groundPosition ) ;

          } else {

            ground.position.z = - 70;

          }

          ground.rotation.x = -Math.PI / 2 ;

          scene.add( ground ) ;

        }


        loader = new THREE.GLTFLoader();
        
        const dracoLoader = new THREE.DRACOLoader();
        dracoLoader.setDecoderPath( '/js/threejs/examples/js/libs/draco/gltf/' );
        loader.setDRACOLoader( dracoLoader );

        var url = sceneInfo.url ;
        
        const loadStartTime = performance.now();

        loader.load( url, function ( data ) {

          gltf = data;

          const object = gltf.scene;

          console.info( 'Load time: ' + ( performance.now() - loadStartTime ).toFixed( 2 ) + ' ms.' );

          if ( sceneInfo.cameraPosition ) {

            camera.position.copy( sceneInfo.cameraPosition );

          }

          if ( sceneInfo.center ) {

            orbitControls.target.copy( sceneInfo.center );

          }

          if ( sceneInfo.objectPosition ) {

            object.position.copy( sceneInfo.objectPosition );

            if ( spot1 ) {

              spot1.target.position.copy( sceneInfo.objectPosition );

            }

          }

          if ( sceneInfo.objectRotation ) {

            object.rotation.copy( sceneInfo.objectRotation );

          }

          if ( sceneInfo.objectScale ) {

            object.scale.copy( sceneInfo.objectScale );

          }

          if ( sceneInfo.addEnvMap ) {

            object.traverse( function ( node ) {

              if ( node.material && ( node.material.isMeshStandardMaterial ||
                  ( node.material.isShaderMaterial && node.material.envMap !== undefined ) ) ) {

                node.material.envMap = envMap ;
                node.material.envMapIntensity = HDRIntensity ; 

              }

            } );

            scene.background = background;

          }

          if( sceneInfo.noMetals ){
            unmetallize(object) ;
          }
          if(!!ground){
            // ground.material.color = new THREE.Color( 0x000000 )    
  
            // for(var j = 0 , l= object.children.length ; j < l ; j++){
            //   var ch = object.children[j] ;
            //   console.log(ch.name)
            //   if(ch.name == 'Box001' || ch.name == 'Box002'){
            //     ch.material.color = new THREE.Color( 0x000000 )    
                
            //   } 
              
            // }
  
            // ground.material.transparent = true;
            // ground.material.opacity = .8;
  
            // ground.material.roughness = .4 ;
            // ground.material.envMap = object.children[4].material.envMap ;

          }
          

          object.traverse( function ( node ) {

            if ( node.isMesh || node.isLight ) node.castShadow = true;

          } ) ;
          
          scene.add( object ) ;
          
          onWindowResize() ;

        }, undefined, function ( error ) {

          console.error( error ) ;

        } );
        
      }

      function unmetallize(object) {
        for(var i = 0 , l= object.children.length ; i < l ; i++){
          if(!! object.children[i].material) object.children[i].material.metalness = 0 ;
        }
      }

      function onWindowResize() {

        camera.aspect = canvascontainer.width() / canvascontainer.height() ;
        camera.updateProjectionMatrix() ;
        renderer.setSize( canvascontainer.width(), canvascontainer.height() ) ;

      }

      var animate = res.userData.animate = function animate() {

        res.userData.ID = requestAnimationFrame( animate ) ;
        orbitControls.update() ;
        render() ;

      }

      function render() {
        renderer.render( scene, camera );
      }


      onload() ;


      }else{
        res.userData.animate();
      }


    }else{
      cancelAnimationFrame(res.userData.ID) ;
    }

  }
}


module.exports = {

  noiseeffect:noise,
  viz3D:viz3D

}