import('../src/config/prisma.js').then(m=>{
  console.log('Loaded prisma from config:', typeof m.default);
  if(m.default && m.default.$disconnect){
    console.log('prisma.$disconnect exists');
    m.default.$disconnect().catch(()=>{});
  }
}).catch(e=>{
  console.error('Failed loading config/prisma:', e && e.message ? e.message : e);
});