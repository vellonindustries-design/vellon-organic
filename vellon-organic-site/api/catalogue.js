import { getCatalogue } from '../lib/catalogue.js';
export default async function handler(request,response){if(request.method!=='GET')return response.status(405).json({error:'Method not allowed'});return response.status(200).json({catalogue:await getCatalogue()})}
