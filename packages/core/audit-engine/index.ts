import { FixItem } from '@/lib/types'

export interface AuditConfig { }
export interface AuditReport { score: number; fixes: FixItem[]; metrics: Record<string, any> }

export async function auditSite(urls: string[], _cfg: AuditConfig): Promise<AuditReport> {
  // Placeholder audit — replace with real crawler
  const fixes: FixItem[] = [
    { id:'naming-1', category:'naming', description:'Standardize floorplan naming (Plan-{Name}-{Beds}BR-{SqFt}sf)', impact:'high', steps:['Identify canonical names','Rename slugs','Update internal links'] },
    { id:'schema-1', category:'schema', description:'Add Product schema to plan pages', impact:'med', steps:['Add JSON-LD','Validate with Rich Results Test'] }
  ]
  return { score: 72, fixes, metrics: { pages: urls.length } }
}
