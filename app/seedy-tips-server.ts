import {getDb} from '../db';import {records} from '../db/schema';import {eq} from 'drizzle-orm';import {defaultTipIds,validTipIds} from './seedy-tips';
export const seedyConfigId='site:seedy-tips';
export async function seedyTipConfig(){const [r]=await getDb().select().from(records).where(eq(records.id,seedyConfigId));const p=r?JSON.parse(r.payload):{},ids=validTipIds(p.selectedIds);return {selectedIds:ids.length?ids:defaultTipIds,updatedAt:Number(p.updatedAt)||0};}
