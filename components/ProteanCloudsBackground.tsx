import React, { useEffect, useRef } from 'react';

const vertexShaderSource = `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
#ifdef GL_ES
precision mediump float;
#endif

uniform float uTime;
uniform vec2 uResolution;

// Pre-computed constants
const mat2 ROT_CONST = mat2(0.8, 0.6, -0.6, 0.8);
const mat3 m3 = mat3(0.33338, 0.56034, -0.71817, -0.87887, 0.32651, -0.15323, 0.15162, 0.69596, 0.61339)*1.93;
const vec3 LIGHT_DIR = normalize(vec3(0.8, 0.6, 0.5));

float mag2(vec2 p){return dot(p,p);} 
float prm1 = 0.;
vec2 bsMo = vec2(0.0);

// Blue noise para reducir banding con menos steps
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

vec2 disp(float t){ 
    // Pre-compute sin/cos
    float s = sin(t*0.22);
    float c = cos(t*0.175);
    return vec2(s, c) * 2.0; 
}

// Versión optimizada de map con LOD
vec2 map(vec3 p, int lod)
{
    vec3 p2 = p;
    p2.xy -= disp(p.z).xy;
    
    // Rotation optimizada
    float angle = sin(p.z + uTime) * (0.1 + prm1 * 0.05) + uTime * 0.09;
    float c = cos(angle);
    float s = sin(angle);
    p.xy = mat2(c, s, -s, c) * p.xy;
    
    float cl = mag2(p2.xy);
    float d = 0.;
    p *= 0.61;
    float z = 1.;
    float trk = 1.;
    float dspAmp = 0.1 + prm1 * 0.2;
    
    // LOD: menos iteraciones para objetos lejanos
    int iterations = lod == 0 ? 2 : (lod == 1 ? 3 : 4);
    
    for(int i = 0; i < 4; i++)
    {
        if(i >= iterations) break;
        p += sin(p.zxy * 0.75 * trk + uTime * trk * 0.8) * dspAmp;
        d -= abs(dot(cos(p), sin(p.yzx)) * z);
        z *= 0.57;
        trk *= 1.4;
        p = p * m3;
    }
    
    d = abs(d + prm1 * 3.0) + prm1 * 0.3 - 2.5 + bsMo.y;
    return vec2(d + cl * 0.2 + 0.25, cl);
}

vec4 renderScene(vec3 ro, vec3 rd, float time, float dither)
{
    vec4 rez = vec4(0.0);
    float t = 1.5 + dither * 0.3; // Blue noise offset para suavizar
    float fogT = 0.;
    
    // Reducido drásticamente el número de steps
    const int MAX_STEPS = 45;
    
    for(int i = 0; i < MAX_STEPS; i++)
    {
        // Early termination más agresivo
        if(rez.a > 0.96) break;

        vec3 pos = ro + t * rd;
        
        // LOD basado en distancia
        int lod = t < 8.0 ? 2 : (t < 16.0 ? 1 : 0);
        vec2 mpv = map(pos, lod);
        
        float den = clamp(mpv.x - 0.3, 0., 1.) * 1.12;
        float dn = clamp(mpv.x + 2.0, 0., 3.);
        
        vec4 col = vec4(0.0);
        if (mpv.x > 0.6)
        {
            // Optimización: usar mix en lugar de operaciones manuales
            vec3 baseCol = sin(vec3(5., 0.4, 0.2) + mpv.y * 0.1 + sin(pos.z * 0.4) * 0.5 + 1.8) * 0.5 + 0.5;
            col = vec4(baseCol, 0.08);
            
            float den3 = den * den * den;
            col *= den3;
            
            // Optimización: linstep simplificado
            col.rgb *= clamp((mpv.x + 2.5) * 0.153846, 0., 1.) * 2.3;
            
            // Iluminación simplificada solo para objetos cercanos
            float dif = 0.5;
            if(t < 12.0) {
                // Solo una muestra de iluminación en lugar de dos
                dif = clamp((den - map(pos + LIGHT_DIR * 0.6, lod).x) * 0.15, 0.001, 1.);
            }
            
            col.xyz *= den * (vec3(0.005, 0.045, 0.075) + vec3(0.0495, 0.105, 0.045) * dif);
        }
        
        // Fog optimizado
        float fogC = exp(t * 0.2 - 2.2);
        col.rgba += vec4(0.06, 0.11, 0.11, 0.1) * clamp(fogC - fogT, 0., 1.);
        fogT = fogC;
        
        // Accumulation optimizado
        rez = mix(rez, rez + col, 1.0 - rez.a);
        
        // Adaptive step size más agresivo
        float stepSize = clamp(0.5 - dn * dn * 0.05, 0.09, 0.3);
        
        // Pasos mucho más grandes para objetos lejanos
        stepSize *= (t < 10.0 ? 1.0 : (t < 20.0 ? 1.8 : 2.5));
        
        t += stepSize;
        
        // Distance culling
        if(t > 35.0) break;
    }
    
    return clamp(rez, 0.0, 1.0);
}

float getsat(vec3 c)
{
    float mi = min(min(c.x, c.y), c.z);
    float ma = max(max(c.x, c.y), c.z);
    return (ma - mi) / (ma + 1e-7);
}

vec3 iLerp(vec3 a, vec3 b, float x)
{
    vec3 ic = mix(a, b, x) + vec3(1e-6, 0., 0.);
    float sd = abs(getsat(ic) - mix(getsat(a), getsat(b), x));
    vec3 dir = normalize(vec3(2.0 * ic.x - ic.y - ic.z, 2.0 * ic.y - ic.x - ic.z, 2.0 * ic.z - ic.y - ic.x));
    float lgt = dot(vec3(1.0), ic);
    float ff = dot(dir, normalize(ic));
    ic += 1.5 * dir * sd * ff * lgt;
    return clamp(ic, 0., 1.);
}

void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 q = fragCoord / uResolution;
    vec2 p = (fragCoord - 0.5 * uResolution) / uResolution.y;
    
    // Blue noise dithering para suavizar con menos steps
    float dither = hash(fragCoord + uTime);
    
    float time = uTime * 3.0;
    vec3 ro = vec3(0., 0., time);
    ro += vec3(sin(uTime) * 0.5, sin(uTime) * 0., 0.);
    
    float dspAmp = 0.85;
    vec2 dispVal = disp(ro.z);
    ro.xy += dispVal * dspAmp;
    
    float tgtDst = 3.5;
    vec2 dispTarget = disp(time + tgtDst);
    vec3 target = normalize(ro - vec3(dispTarget * dspAmp, time + tgtDst));
    ro.x -= bsMo.x * 2.0;
    
    vec3 rightdir = normalize(cross(target, vec3(0., 1., 0.)));
    vec3 updir = normalize(cross(rightdir, target));
    rightdir = normalize(cross(updir, target));
    
    vec3 rd = normalize(p.x * rightdir + p.y * updir - target);
    
    // Rotation optimizada
    float rotAngle = -disp(time + 3.5).x * 0.2 + bsMo.x;
    float c = cos(rotAngle);
    float s = sin(rotAngle);
    rd.xy = mat2(c, s, -s, c) * rd.xy;
    
    prm1 = smoothstep(-0.4, 0.4, sin(uTime * 0.3));
    
    vec4 scn = renderScene(ro, rd, time, dither);
    
    vec3 col = scn.rgb;
    col = iLerp(col.bgr, col.rgb, clamp(1.0 - prm1, 0.05, 1.));
    col = pow(col, vec3(0.55, 0.65, 0.6)) * vec3(1., 0.97, 0.9);
    
    // Vignette optimizado
    col *= pow(16.0 * q.x * q.y * (1.0 - q.x) * (1.0 - q.y), 0.12) * 0.7 + 0.3;
    
    gl_FragColor = vec4(col, 1.0);
}
`;

const ProteanCloudsBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: false,
      depth: false,
      stencil: false,
      antialias: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance'
    });
    
    if (!gl) return;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) throw new Error('Unable to create shader');
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(info || 'Failed to compile shader');
      }
      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    const program = gl.createProgram();
    if (!program) throw new Error('Unable to create program');

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program);
      throw new Error(info || 'Failed to link program');
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, 'uTime');
    const resolutionLocation = gl.getUniformLocation(program, 'uResolution');

    const resize = () => {
      // Rendering a mitad de resolución para máximo rendimiento
      const dpr = Math.min(window.devicePixelRatio || 1, 1);
      const scale = 0.75; // Render al 75% de la resolución
      const width = Math.floor(canvas.clientWidth * dpr * scale);
      const height = Math.floor(canvas.clientHeight * dpr * scale);
      
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const render = (time: number) => {
      gl.uniform1f(timeLocation, time * 0.001);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      if (positionBuffer) gl.deleteBuffer(positionBuffer);
      if (program) gl.deleteProgram(program);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none" 
      style={{ imageRendering: 'auto' }}
      aria-hidden="true" 
    />
  );
};

export default ProteanCloudsBackground;