// =====================================================
// LINGUISTIC DATA IMPORT SCRIPTS
// =====================================================
// Scripts to download and import linguistic reference data

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { parse } from 'csv-parse';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// =====================================================
// 1. IMPORT NGSL (New General Service List)
// =====================================================
export async function importNGSL() {
  console.log('Importing NGSL word list...');
  
  // NGSL is freely available
  const ngslUrl = 'http://www.newgeneralservicelist.org/s/NGSL-101-by-band-qq9o.csv';
  const localPath = './data/ngsl.csv';
  
  // Download if not exists
  if (!fs.existsSync(localPath)) {
    await downloadFile(ngslUrl, localPath);
  }
  
  // Parse and import
  const records = await parseCSV(localPath);
  
  for (const record of records) {
    const cefrLevel = mapFrequencyToCEFR(record.rank);
    
    await supabase.from('cefr_word_levels').upsert({
      word: record.word.toLowerCase(),
      cefr_level: cefrLevel,
      pos_tag: record.pos || null,
      word_family: [record.word, ...(record.family || [])],
      example_sentences: [],
    });
  }
  
  console.log('NGSL import complete');
}

// =====================================================
// 2. IMPORT AWL (Academic Word List)
// =====================================================
export async function importAWL() {
  console.log('Importing Academic Word List...');
  
  // AWL data structure
  const awlSublists = {
    1: ['analyze', 'approach', 'area', 'assess', 'assume', 'authority', 'available', 'benefit', 'concept', 'consist', 'constitute', 'context', 'contract', 'create', 'data', 'define', 'derive', 'distribute', 'economy', 'environment', 'establish', 'estimate', 'evident', 'export', 'factor', 'finance', 'formula', 'function', 'identify', 'income', 'indicate', 'individual', 'interpret', 'involve', 'issue', 'labour', 'legal', 'legislate', 'major', 'method', 'occur', 'percent', 'period', 'policy', 'principle', 'proceed', 'process', 'require', 'research', 'respond', 'role', 'section', 'sector', 'significant', 'similar', 'source', 'specific', 'structure', 'theory', 'vary'],
    2: ['achieve', 'acquire', 'administrate', 'affect', 'appropriate', 'aspect', 'assist', 'category', 'chapter', 'commission', 'community', 'complex', 'compute', 'conclude', 'conduct', 'consequent', 'construct', 'consume', 'credit', 'culture', 'design', 'distinct', 'element', 'equate', 'evaluate', 'feature', 'final', 'focus', 'impact', 'injure', 'institute', 'invest', 'item', 'journal', 'maintain', 'normal', 'obtain', 'participate', 'perceive', 'positive', 'potential', 'previous', 'primary', 'purchase', 'range', 'region', 'regulate', 'relevant', 'reside', 'resource', 'restrict', 'secure', 'seek', 'select', 'site', 'strategy', 'survey', 'text', 'tradition', 'transfer'],
    // Add more sublists as needed
  };
  
  for (const [sublist, words] of Object.entries(awlSublists)) {
    for (const headword of words) {
      const wordForms = generateWordForms(headword);
      
      for (const word of wordForms) {
        await supabase.from('academic_word_list').upsert({
          word: word.toLowerCase(),
          headword: headword.toLowerCase(),
          sublist: parseInt(sublist),
          word_family: wordForms,
        });
      }
    }
  }
  
  console.log('AWL import complete');
}

// =====================================================
// 3. IMPORT DISCOURSE MARKERS
// =====================================================
export async function importDiscourseMarkers() {
  console.log('Importing discourse markers...');
  
  // This data is already in the seed file, but here's how to import from external source
  const markers = [
    { marker: 'however', category: 'contrast', function: 'showing opposition', register: 'neutral', cefr_level: 'B1' },
    { marker: 'therefore', category: 'cause_effect', function: 'showing result', register: 'formal', cefr_level: 'B2' },
    // ... more markers
  ];
  
  for (const marker of markers) {
    await supabase.from('discourse_markers').upsert(marker);
  }
  
  console.log('Discourse markers import complete');
}

// =====================================================
// 4. IMPORT SAMPLE WORD FREQUENCIES
// =====================================================
export async function importWordFrequencies() {
  console.log('Importing word frequency data...');
  
  // For demo purposes, import a small sample
  // In production, you would download and import the full SUBTLEXus database
  const sampleFrequencies = [
    { word: 'the', frequency: 29944024, frequency_per_million: 5884.02, log_frequency: 7.476, word_rank: 1 },
    { word: 'be', frequency: 13151999, frequency_per_million: 2584.16, log_frequency: 7.119, word_rank: 2 },
    // ... more words
  ];
  
  for (const entry of sampleFrequencies) {
    await supabase.from('word_frequency_database').upsert({
      ...entry,
      pos_tags: [], // Would be populated from linguistic analysis
    });
  }
  
  console.log('Word frequency import complete');
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {}); // Delete incomplete file
      reject(err);
    });
  });
}

function parseCSV(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const records: any[] = [];
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true }))
      .on('data', (data) => records.push(data))
      .on('end', () => resolve(records))
      .on('error', reject);
  });
}

function mapFrequencyToCEFR(rank: number): string {
  if (rank <= 1000) return 'A1';
  if (rank <= 2000) return 'A2';
  if (rank <= 3000) return 'B1';
  if (rank <= 5000) return 'B2';
  if (rank <= 10000) return 'C1';
  return 'C2';
}

function generateWordForms(headword: string): string[] {
  // Simple word form generation - in production, use a proper morphology library
  const forms = [headword];
  
  // Add common suffixes
  if (headword.endsWith('e')) {
    forms.push(headword + 'd', headword + 's', headword.slice(0, -1) + 'ing');
  } else if (headword.endsWith('y')) {
    forms.push(headword.slice(0, -1) + 'ies', headword.slice(0, -1) + 'ied', headword + 'ing');
  } else {
    forms.push(headword + 's', headword + 'ed', headword + 'ing');
  }
  
  return [...new Set(forms)]; // Remove duplicates
}

// =====================================================
// MAIN IMPORT FUNCTION
// =====================================================
export async function importAllLinguisticData() {
  try {
    console.log('Starting linguistic data import...');
    
    // Import in sequence to avoid overwhelming the database
    await importNGSL();
    await importAWL();
    await importDiscourseMarkers();
    await importWordFrequencies();
    
    console.log('All linguistic data imported successfully!');
  } catch (error) {
    console.error('Error importing linguistic data:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  importAllLinguisticData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}