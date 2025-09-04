export default async function (context, req) {
  context.log('test function executed - completely isolated');
  
  return new Response(JSON.stringify({
    message: 'Function is working perfectly!',
    method: req.method,
    timestamp: new Date().toISOString(),
    status: 'OK'
  }), { 
    status: 200, 
    headers: { 'Content-Type': 'application/json' } 
  });
}
