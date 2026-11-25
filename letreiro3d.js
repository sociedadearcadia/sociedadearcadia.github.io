/* Logo 3D "Sociedade Arcádia" (WebGL puro, sem biblioteca).
   As letras do logo viram relevo dourado com bordas arredondadas, a partir da transparência do /logo-arcadia.png.
   Uso: <div class="letreiro3d" data-letreiro3d></div> + <script src="/letreiro3d.js"></script>
   Leve para o iPhone: um canvas pequeno, desenha só quando está na tela e para quando a aba fica escondida. */
(function(){
  const W=768,NX=300,Z=.075; // resolução do relevo, da malha e profundidade das letras
  const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let HH=334,NY=130;

  function relief(img){
    HH=Math.round(W*img.naturalHeight/img.naturalWidth);NY=Math.round(NX*HH/W);
    const c=document.createElement('canvas');c.width=W;c.height=HH;const g=c.getContext('2d');g.drawImage(img,0,0,W,HH);
    const d=g.getImageData(0,0,W,HH).data,n=W*HH,a=new Float32Array(n);
    for(let i=0;i<n;i++)a[i]=d[i*4+3]/255;
    const blur=(src,r)=>{let A=src.slice(),B=new Float32Array(n);for(let pass=0;pass<2;pass++){
      for(let y=0;y<HH;y++){let s=0;for(let x=-r;x<=r;x++)s+=A[y*W+Math.min(W-1,Math.max(0,x))];
        for(let x=0;x<W;x++){B[y*W+x]=s/(2*r+1);s+=A[y*W+Math.min(W-1,x+r+1)]-A[y*W+Math.max(0,x-r)]}}
      for(let x=0;x<W;x++){let s=0;for(let y=-r;y<=r;y++)s+=B[Math.min(HH-1,Math.max(0,y))*W+x];
        for(let y=0;y<HH;y++){A[y*W+x]=s/(2*r+1);s+=B[Math.min(HH-1,y+r+1)*W+x]-B[Math.max(0,y-r)*W+x]}}}return A};
    const b=blur(a,3),H=new Float32Array(n),D=new Float32Array(n),t1=new Uint8Array(n*4),t2=new Uint8Array(n*4);
    for(let i=0;i<n;i++){const k=Math.min(1,Math.max(0,(b[i]-.3)/.6));H[i]=Math.sqrt(k)*a[i];D[i]=H[i]*.55}
    const k=Z*W/4,at=(A,x,y)=>A[Math.min(HH-1,Math.max(0,y))*W+Math.min(W-1,Math.max(0,x))];
    for(let y=0;y<HH;y++)for(let x=0;x<W;x++){const i=y*W+x;
      let nx=-(at(H,x+1,y)-at(H,x-1,y))*k,ny=(at(H,x,y+1)-at(H,x,y-1))*k,l=Math.hypot(nx,ny,1);
      t1[i*4]=(nx/l*.5+.5)*255;t1[i*4+1]=(ny/l*.5+.5)*255;t1[i*4+2]=(1/l*.5+.5)*255;t1[i*4+3]=a[i]*255;
      nx=-(at(D,x+1,y)-at(D,x-1,y))*k;ny=(at(D,x,y+1)-at(D,x,y-1))*k;l=Math.hypot(nx,ny,1);
      t2[i*4]=(nx/l*.5+.5)*255;t2[i*4+1]=(ny/l*.5+.5)*255;t2[i*4+2]=(-1/l*.5+.5)*255;t2[i*4+3]=H[i]*255}
    return{H,D,M:a,t1,t2}}

  function mat(){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}
  function mul(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++){let s=0;for(let k=0;k<4;k++)s+=a[k*4+r]*b[c*4+k];o[c*4+r]=s}return o}
  function rotX(t){const m=mat(),c=Math.cos(t),s=Math.sin(t);m[5]=c;m[6]=s;m[9]=-s;m[10]=c;return m}
  function rotY(t){const m=mat(),c=Math.cos(t),s=Math.sin(t);m[0]=c;m[2]=-s;m[8]=s;m[10]=c;return m}
  function rotZ(t){const m=mat(),c=Math.cos(t),s=Math.sin(t);m[0]=c;m[1]=s;m[4]=-s;m[5]=c;return m}
  function persp(f,n,fa){const t=1/Math.tan(f/2),m=new Float32Array(16);m[0]=t;m[5]=t;m[10]=(fa+n)/(n-fa);m[11]=-1;m[14]=2*fa*n/(n-fa);return m}

  const VS=`attribute vec3 aP;attribute vec2 aU;uniform mat4 uM,uPV;varying vec2 vU;varying vec3 vW;
    void main(){vU=aU;vec4 w=uM*vec4(aP,1.);vW=w.xyz;gl_Position=uPV*w;}`;
  const FS=`precision highp float;uniform sampler2D uN,uK;uniform mat4 uM;uniform vec3 uL,uE;uniform float uB;varying vec2 vU;varying vec3 vW;
    void main(){vec4 a=texture2D(uN,vU);if(a.a<.5)discard;vec4 b=texture2D(uK,vU);
      vec3 n=(uB<.5?a.xyz:b.xyz)*2.-1.;float h=b.a;
      vec3 col=uB<.5?mix(vec3(.86,.66,.36),vec3(1.,.9,.7),h*h):vec3(.55,.4,.25);
      n=normalize(mat3(uM)*normalize(n));vec3 v=normalize(uE-vW);
      vec3 l=normalize(uL);float nl=dot(n,l),df=max(nl,0.)*.75+.25*(nl*.5+.5);
      vec3 r=reflect(-v,n);vec3 env=mix(vec3(.22,.1,.32),vec3(1.,.82,.95),smoothstep(-.6,.9,r.y));
      env=mix(env,vec3(1.,.9,.7),smoothstep(.55,1.,dot(r,l))*.8);
      vec3 hv=normalize(l+v);float sp=pow(max(dot(n,hv),0.),48.);
      float fr=pow(1.-max(dot(n,v),0.),3.);
      vec3 c=col*(df*.55+env*.55+.12)+vec3(1.,.92,.75)*sp*.9+vec3(.95,.6,.85)*fr*.35;
      gl_FragColor=vec4(c,1.);}`;

  function boot(box){
    const img=new Image();img.decoding='async';
    const fallback=()=>{box.classList.add('flat');if(!box.querySelector('img')){const f=new Image();f.src='/logo-arcadia.png';f.alt='';box.appendChild(f)}};
    const cv=document.createElement('canvas');cv.setAttribute('aria-hidden','true');box.appendChild(cv);
    const gl=cv.getContext('webgl',{antialias:true,alpha:true,premultipliedAlpha:true,powerPreference:'low-power'});
    if(!gl){cv.remove();fallback();return}
    img.onerror=()=>{cv.remove();fallback()};
    img.onload=()=>{
      const R=relief(img);
      const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))console.warn('letreiro3d',gl.getShaderInfoLog(o));return o};
      const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);
      if(!gl.getProgramParameter(pr,gl.LINK_STATUS)){console.warn('letreiro3d',gl.getProgramInfoLog(pr));cv.remove();fallback();return}
      gl.useProgram(pr);
      // malha só onde há letra: frente em relevo e verso mais raso
      const smp=(A,u,v)=>{const x=Math.min(W-1,Math.max(0,u*(W-1))),y=Math.min(HH-1,Math.max(0,v*(HH-1))),x0=x|0,y0=y|0,x1=Math.min(W-1,x0+1),y1=Math.min(HH-1,y0+1),fx=x-x0,fy=y-y0;
        return(A[y0*W+x0]*(1-fx)+A[y0*W+x1]*fx)*(1-fy)+(A[y1*W+x0]*(1-fx)+A[y1*W+x1]*fx)*fy};
      const asp=HH/W,pos=[],back=[],uv=[],idx=[],id=new Int32Array((NX+1)*(NY+1)).fill(-1);let k=0;
      for(let j=0;j<=NY;j++)for(let i=0;i<=NX;i++){const u=i/NX,v=j/NY;
        let near=false;for(let a=-1;a<=1&&!near;a++)for(let b=-1;b<=1&&!near;b++)if(smp(R.M,u+a/NX,v+b/NY)>.02)near=true;
        if(!near)continue;id[j*(NX+1)+i]=k++;
        const x=u*2-1,y=(1-v*2)*asp;pos.push(x,y,smp(R.H,u,v)*Z);back.push(x,y,-smp(R.D,u,v)*Z);uv.push(u,v)}
      for(let j=0;j<NY;j++)for(let i=0;i<NX;i++){const a=id[j*(NX+1)+i],b=id[j*(NX+1)+i+1],c=id[(j+1)*(NX+1)+i],d=id[(j+1)*(NX+1)+i+1];
        if(a<0||b<0||c<0||d<0)continue;idx.push(a,c,b,b,c,d)}
      const buf=(data,T)=>{const b=gl.createBuffer();gl.bindBuffer(T,b);gl.bufferData(T,data,gl.STATIC_DRAW);return b};
      const bF=buf(new Float32Array(pos),gl.ARRAY_BUFFER),bB=buf(new Float32Array(back),gl.ARRAY_BUFFER),bU=buf(new Float32Array(uv),gl.ARRAY_BUFFER);
      const big=k>65535,ext=big&&gl.getExtension('OES_element_index_uint');
      buf(big?new Uint32Array(idx):new Uint16Array(idx),gl.ELEMENT_ARRAY_BUFFER);const IT=big&&ext?gl.UNSIGNED_INT:gl.UNSIGNED_SHORT;
      const tex=(unit,src)=>{const t=gl.createTexture();gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,t);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,W,HH,0,gl.RGBA,gl.UNSIGNED_BYTE,src);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE)};
      tex(1,R.t1);tex(2,R.t2);
      const U=n=>gl.getUniformLocation(pr,n),aP=gl.getAttribLocation(pr,'aP'),aU=gl.getAttribLocation(pr,'aU');
      gl.uniform1i(U('uN'),1);gl.uniform1i(U('uK'),2);
      gl.bindBuffer(gl.ARRAY_BUFFER,bU);gl.enableVertexAttribArray(aU);gl.vertexAttribPointer(aU,2,gl.FLOAT,false,0,0);
      gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);
      const CA=.5,E=[0,0,1.2/(Math.tan(.24)/CA)];const PV=mul(persp(.48,.1,20),(()=>{const m=mat();m[14]=-E[2];return m})());PV[0]*=CA;
      gl.uniformMatrix4fv(U('uPV'),false,PV);gl.uniform3fv(U('uE'),E);

      // movimento: balanço lento + segue o mouse + gira com a rolagem; toque dá uma volta inteira
      let tx=0,ty=0,cx=0,cy=0,spin=0,spinT=0,vis=false,raf=0,last=0;
      const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
      if(fine)addEventListener('pointermove',e=>{tx=(e.clientX/innerWidth-.5)*.6;ty=(e.clientY/innerHeight-.5)*.4},{passive:true});
      box.addEventListener('click',()=>{spinT+=6.2832;wake()});
      function size(){const d=Math.min(devicePixelRatio||1,2),w=box.clientWidth;cv.width=Math.round(w*d);cv.height=Math.round(w*d*CA)}
      function draw(now){raf=0;const t=now/1000,dt=Math.min(.05,(now-(last||now))/1000);last=now;
        if(cv.width!==Math.round(box.clientWidth*Math.min(devicePixelRatio||1,2)))size();
        const r=box.getBoundingClientRect(),sc=((r.top+r.height/2)/innerHeight-.5);
        const gx=calm?0:tx+Math.sin(t*.6)*.25+sc*-.45,gy=calm?0:ty+Math.sin(t*.45+1)*.12+sc*.3;
        cx+=(gx-cx)*Math.min(1,dt*4);cy+=(gy-cy)*Math.min(1,dt*4);spin+=(spinT-spin)*Math.min(1,dt*2.2);
        const M=mul(rotY(cx+spin),mul(rotX(cy),rotZ(calm?0:Math.sin(t*.3)*.02)));
        gl.viewport(0,0,cv.width,cv.height);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        gl.uniformMatrix4fv(U('uM'),false,M);gl.uniform3f(U('uL'),-.5-tx*.8,.7-ty*.5,.9);
        for(const [b,f] of [[bB,1],[bF,0]]){gl.uniform1f(U('uB'),f);gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.vertexAttribPointer(aP,3,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(aP);gl.drawElements(gl.TRIANGLES,idx.length,IT,0)}
        box.style.setProperty('--tilt',(cx+spin).toFixed(3));
        if(vis&&!document.hidden&&(!calm||Math.abs(spinT-spin)>.001))wake()}
      function wake(){if(!raf)raf=requestAnimationFrame(draw)}
      size();addEventListener('resize',()=>{size();wake()});
      new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis)wake()},{rootMargin:'80px'}).observe(box);
      document.addEventListener('visibilitychange',wake);
      box.classList.add('ready');wake()};
    img.src=box.dataset.src||'/logo-arcadia.png'}

  document.querySelectorAll('[data-letreiro3d]').forEach(boot);
})();
