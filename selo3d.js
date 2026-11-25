/* Selo 3D da Sociedade Arcádia (WebGL puro, sem biblioteca).
   O relevo sai do próprio logo: o anel de cera roxo fica alto, o centro de papel fica rebaixado e as letras levemente em relevo.
   Uso: <div class="selo3d" data-selo3d></div> + <script src="/selo3d.js"></script>
   Leve para o iPhone: um canvas pequeno, desenha só quando está na tela e para quando a aba fica escondida. */
(function(){
  const S=256,N=150,Z=.2; // resolução do mapa de relevo e da malha
  const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;

  function relief(img){
    const c=document.createElement('canvas');c.width=c.height=S;const g=c.getContext('2d');g.drawImage(img,0,0,S,S);
    const d=g.getImageData(0,0,S,S).data,p=new Float32Array(S*S);
    for(let i=0;i<S*S;i++){const l=.3*d[i*4]+.59*d[i*4+1]+.11*d[i*4+2];p[i]=Math.min(1,Math.max(0,(190-l)/90))}
    // borda de fora do anel de cera, ângulo por ângulo
    const A=720,edge=new Float32Array(A),cx=S/2;
    for(let a=0;a<A;a++){const t=a/A*6.2832,co=Math.cos(t),si=Math.sin(t);let r=S*.49;
      for(;r>S*.25;r-=.5){const x=Math.round(cx+co*r),y=Math.round(cx+si*r);if(p[y*S+x]>.5)break}edge[a]=r}
    const ed=new Float32Array(A);for(let a=0;a<A;a++){let s=0;for(let k=-4;k<=4;k++)s+=edge[(a+k+A)%A];ed[a]=s/9}
    const blur=(src,r)=>{let a=src.slice(),b=new Float32Array(S*S);for(let pass=0;pass<2;pass++){
      for(let y=0;y<S;y++){let s=0;for(let x=-r;x<=r;x++)s+=a[y*S+Math.min(S-1,Math.max(0,x))];
        for(let x=0;x<S;x++){b[y*S+x]=s/(2*r+1);s+=a[y*S+Math.min(S-1,x+r+1)]-a[y*S+Math.max(0,x-r)]}}
      for(let x=0;x<S;x++){let s=0;for(let y=-r;y<=r;y++)s+=b[Math.min(S-1,Math.max(0,y))*S+x];
        for(let y=0;y<S;y++){a[y*S+x]=s/(2*r+1);s+=b[Math.min(S-1,y+r+1)*S+x]-b[Math.max(0,y-r)*S+x]}}}return a};
    const pw=blur(p,3),pf=blur(p,1);
    const H=new Float32Array(S*S),M=new Float32Array(S*S),D=new Float32Array(S*S),t1=new Uint8Array(S*S*4),t2=new Uint8Array(S*S*4);
    const sm=(a,b,x)=>{x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x)};
    for(let y=0;y<S;y++)for(let x=0;x<S;x++){const i=y*S+x,dx=x+.5-cx,dy=y+.5-cx,r=Math.hypot(dx,dy);
      let a=Math.atan2(dy,dx);if(a<0)a+=6.2832;const e=ed[Math.floor(a/6.2832*A)%A];
      const m=sm(e+1.2,e-1.2,r),ring=sm(.7*e,.78*e,r),u=Math.min(1,Math.max(0,(e-r)/(.09*e)));
      const dome=.06*(1-Math.min(1,(r/e)**2));
      let h=.3+ring*.55*pw[i]+(1-ring)*.07*pf[i]+dome;h*=1-(1-u)**2.2;
      H[i]=h*m;M[i]=m;D[i]=(.18+dome*2)*(1-(1-u)**2)*m}
    // normais calculadas aqui (em ponto flutuante) para o papel não ficar com faixas
    const k=Z*S/4,at=(A,x,y)=>A[Math.min(S-1,Math.max(0,y))*S+Math.min(S-1,Math.max(0,x))];
    for(let y=0;y<S;y++)for(let x=0;x<S;x++){const i=y*S+x;
      let nx=-(at(H,x+1,y)-at(H,x-1,y))*k,ny=(at(H,x,y+1)-at(H,x,y-1))*k,l=Math.hypot(nx,ny,1);
      t1[i*4]=(nx/l*.5+.5)*255;t1[i*4+1]=(ny/l*.5+.5)*255;t1[i*4+2]=(1/l*.5+.5)*255;t1[i*4+3]=M[i]*255;
      nx=-(at(D,x+1,y)-at(D,x-1,y))*k*.8;ny=(at(D,x,y+1)-at(D,x,y-1))*k*.8;l=Math.hypot(nx,ny,1);
      t2[i*4]=(nx/l*.5+.5)*255;t2[i*4+1]=(ny/l*.5+.5)*255;t2[i*4+2]=(-1/l*.5+.5)*255;t2[i*4+3]=p[i]*255}
    return{H,M,D,t1,t2}}

  function mat(){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}
  function mul(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++){let s=0;for(let k=0;k<4;k++)s+=a[k*4+r]*b[c*4+k];o[c*4+r]=s}return o}
  function rotX(t){const m=mat(),c=Math.cos(t),s=Math.sin(t);m[5]=c;m[6]=s;m[9]=-s;m[10]=c;return m}
  function rotY(t){const m=mat(),c=Math.cos(t),s=Math.sin(t);m[0]=c;m[2]=-s;m[8]=s;m[10]=c;return m}
  function rotZ(t){const m=mat(),c=Math.cos(t),s=Math.sin(t);m[0]=c;m[1]=s;m[4]=-s;m[5]=c;return m}
  function persp(f,n,fa){const t=1/Math.tan(f/2),m=new Float32Array(16);m[0]=t;m[5]=t;m[10]=(fa+n)/(n-fa);m[11]=-1;m[14]=2*fa*n/(n-fa);return m}

  const VS=`attribute vec3 aP;attribute vec2 aU;uniform mat4 uM,uPV;varying vec2 vU;varying vec3 vW;
    void main(){vU=aU;vec4 w=uM*vec4(aP,1.);vW=w.xyz;gl_Position=uPV*w;}`;
  const FS=`precision highp float;uniform sampler2D uC,uN,uK;uniform mat4 uM;uniform vec3 uL,uE;uniform float uB;varying vec2 vU;varying vec3 vW;
    void main(){vec4 a=texture2D(uN,vU);if(a.a<.5)discard;vec4 b=texture2D(uK,vU);
      vec3 n;vec3 col;float wax;
      if(uB<.5){n=a.xyz*2.-1.;col=texture2D(uC,vU).rgb;wax=b.a;}else{n=b.xyz*2.-1.;col=vec3(.33,.16,.52);wax=1.;}
      n=normalize(mat3(uM)*normalize(n));vec3 v=normalize(uE-vW);
      vec3 l=normalize(uL);float nl=dot(n,l),df=max(nl,0.)*.8+.2*(nl*.5+.5);
      vec3 l2=normalize(vec3(.9,-.4,.6));float d2=max(dot(n,l2),0.);
      vec3 hv=normalize(l+v);float sp=pow(max(dot(n,hv),0.),mix(18.,70.,wax))*mix(.08,.8,wax);
      float fr=pow(1.-max(dot(n,v),0.),3.);
      vec3 fill=mix(vec3(.5,.45,.42),vec3(.6,.45,.95),wax);
      vec3 c=col*(vec3(1.,.96,.9)*df*mix(1.22,1.08,wax)+fill*d2*.35+mix(vec3(.26,.23,.21),vec3(.16,.11,.24),wax));
      c+=vec3(1.,.93,.8)*sp+vec3(.95,.72,.45)*fr*.5*wax;
      gl_FragColor=vec4(c,1.);}`;

  function boot(box){
    const img=new Image();img.decoding='async';
    const fallback=()=>{box.classList.add('flat');if(!box.querySelector('img')){const f=new Image();f.src='/selo-arcadia.png';f.alt='';box.appendChild(f)}};
    const cv=document.createElement('canvas');cv.setAttribute('aria-hidden','true');box.appendChild(cv);
    const gl=cv.getContext('webgl',{antialias:true,alpha:true,premultipliedAlpha:true,powerPreference:'low-power'});
    if(!gl){cv.remove();fallback();return}
    img.onerror=()=>{cv.remove();fallback()};
    img.onload=()=>{
      const R=relief(img);
      const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))console.warn('selo3d',gl.getShaderInfoLog(o));return o};
      const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);
      if(!gl.getProgramParameter(pr,gl.LINK_STATUS)){console.warn('selo3d',gl.getProgramInfoLog(pr));cv.remove();fallback();return}
      gl.useProgram(pr);
      // malha: frente (relevo do logo) e verso (cera lisa)
      const smp=(A,u,v)=>{const x=Math.min(S-1,Math.max(0,u*(S-1))),y=Math.min(S-1,Math.max(0,v*(S-1))),x0=x|0,y0=y|0,x1=Math.min(S-1,x0+1),y1=Math.min(S-1,y0+1),fx=x-x0,fy=y-y0;
        return(A[y0*S+x0]*(1-fx)+A[y0*S+x1]*fx)*(1-fy)+(A[y1*S+x0]*(1-fx)+A[y1*S+x1]*fx)*fy};
      const pos=[],back=[],uv=[],idx=[],id=new Int32Array((N+1)*(N+1)).fill(-1);let k=0;
      for(let j=0;j<=N;j++)for(let i=0;i<=N;i++){const u=i/N,v=j/N;
        let near=false;for(let a=-1;a<=1&&!near;a++)for(let b=-1;b<=1&&!near;b++)if(smp(R.M,u+a/N,v+b/N)>.02)near=true;
        if(!near)continue;id[j*(N+1)+i]=k++;
        const x=u*2-1,y=1-v*2;pos.push(x,y,smp(R.H,u,v)*Z);back.push(x,y,-smp(R.D,u,v)*Z*.8);uv.push(u,v)}
      for(let j=0;j<N;j++)for(let i=0;i<N;i++){const a=id[j*(N+1)+i],b=id[j*(N+1)+i+1],c=id[(j+1)*(N+1)+i],d=id[(j+1)*(N+1)+i+1];
        if(a<0||b<0||c<0||d<0)continue;idx.push(a,c,b,b,c,d)}
      const buf=(data,T)=>{const b=gl.createBuffer();gl.bindBuffer(T,b);gl.bufferData(T,data,gl.STATIC_DRAW);return b};
      const bF=buf(new Float32Array(pos),gl.ARRAY_BUFFER),bB=buf(new Float32Array(back),gl.ARRAY_BUFFER),bU=buf(new Float32Array(uv),gl.ARRAY_BUFFER);
      const big=k>65535,ext=big&&gl.getExtension('OES_element_index_uint');
      buf(big?new Uint32Array(idx):new Uint16Array(idx),gl.ELEMENT_ARRAY_BUFFER);const IT=big&&ext?gl.UNSIGNED_INT:gl.UNSIGNED_SHORT;
      const tex=(unit,src,raw)=>{const t=gl.createTexture();gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,t);
        if(raw)gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,S,S,0,gl.RGBA,gl.UNSIGNED_BYTE,src);else gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,src);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE)};
      tex(0,img);tex(1,R.t1,true);tex(2,R.t2,true);
      const U=n=>gl.getUniformLocation(pr,n),aP=gl.getAttribLocation(pr,'aP'),aU=gl.getAttribLocation(pr,'aU');
      gl.uniform1i(U('uC'),0);gl.uniform1i(U('uN'),1);gl.uniform1i(U('uK'),2);
      gl.bindBuffer(gl.ARRAY_BUFFER,bU);gl.enableVertexAttribArray(aU);gl.vertexAttribPointer(aU,2,gl.FLOAT,false,0,0);
      gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);
      const E=[0,0,4.2],PV=mul(persp(.48,.1,20),(()=>{const m=mat();m[14]=-E[2];return m})());
      gl.uniformMatrix4fv(U('uPV'),false,PV);gl.uniform3fv(U('uE'),E);

      // movimento: balanço lento + segue o mouse + gira com a rolagem; toque dá uma volta inteira
      let tx=0,ty=0,cx=0,cy=0,spin=0,spinT=0,vis=false,raf=0,last=0;
      const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
      if(fine)addEventListener('pointermove',e=>{tx=(e.clientX/innerWidth-.5)*.7;ty=(e.clientY/innerHeight-.5)*.5},{passive:true});
      box.addEventListener('click',()=>{spinT+=6.2832;wake()});
      function size(){const d=Math.min(devicePixelRatio||1,2),w=box.clientWidth;cv.width=cv.height=Math.round(w*d)}
      function draw(now){raf=0;const t=now/1000,dt=Math.min(.05,(now-(last||now))/1000);last=now;
        if(cv.width!==Math.round(box.clientWidth*Math.min(devicePixelRatio||1,2)))size();
        const r=box.getBoundingClientRect(),sc=((r.top+r.height/2)/innerHeight-.5);
        const gx=calm?0:tx+Math.sin(t*.6)*.22+sc*-.5,gy=calm?0:ty+Math.sin(t*.45+1)*.1+sc*.25;
        cx+=(gx-cx)*Math.min(1,dt*4);cy+=(gy-cy)*Math.min(1,dt*4);spin+=(spinT-spin)*Math.min(1,dt*2.2);
        const M=mul(rotY(cx+spin),mul(rotX(cy),rotZ(calm?0:Math.sin(t*.3)*.04)));
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
    img.src=box.dataset.src||'/selo-arcadia.png'}

  document.querySelectorAll('[data-selo3d]').forEach(boot);
})();
