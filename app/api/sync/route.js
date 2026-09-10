import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://uiaicluwzdhvobmghwhj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_xuM5EmeXrR-_tZry3SvzKw_kRRg0c6s'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function GET() {
  try {
    const { data, error } = await supabase.from('estudio_data').select('*');
    if (error) throw error;

    let globalStore = {};
    if (data && Array.isArray(data)) {
      data.forEach(item => {
        const k = item.id || item.key;
        const v = item.value || item.data;
        if (k && v) {
          globalStore[k] = v;
        }
      });
    }
    return NextResponse.json(globalStore);
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { key, value } = body;
    if (key) {
      const { error } = await supabase
        .from('estudio_data')
        .upsert({ id: key, value }, { onConflict: 'id' });

      if (error) throw error;
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
