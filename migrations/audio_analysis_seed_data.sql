-- =====================================================
-- AUDIO ANALYSIS REFERENCE DATA SEED
-- =====================================================
-- Run this after the migration to populate reference tables
-- with initial linguistic data
-- =====================================================

-- =====================================================
-- DISCOURSE MARKERS
-- =====================================================

INSERT INTO discourse_markers (marker, category, function, register, cefr_level, examples) VALUES
-- Addition markers
('furthermore', 'addition', 'adding information', 'formal', 'B2', '["Furthermore, the results indicate...", "The theory is sound; furthermore, it has been tested."]'),
('moreover', 'addition', 'adding emphasis', 'formal', 'B2', '["Moreover, this approach is cost-effective.", "The plan is feasible; moreover, it''s sustainable."]'),
('in addition', 'addition', 'adding information', 'neutral', 'B1', '["In addition, we need to consider...", "In addition to the main points..."]'),
('also', 'addition', 'adding information', 'neutral', 'A2', '["I also think that...", "She is also a teacher."]'),
('and', 'addition', 'basic conjunction', 'neutral', 'A1', '["I like tea and coffee.", "She sings and dances."]'),

-- Contrast markers
('however', 'contrast', 'showing opposition', 'neutral', 'B1', '["However, there are some issues.", "The idea is good; however, it''s expensive."]'),
('nevertheless', 'contrast', 'strong contrast', 'formal', 'B2', '["Nevertheless, we must proceed.", "It''s risky; nevertheless, it''s worth trying."]'),
('on the other hand', 'contrast', 'presenting alternative', 'neutral', 'B1', '["On the other hand, we could...", "It''s expensive; on the other hand, it''s durable."]'),
('but', 'contrast', 'basic opposition', 'neutral', 'A1', '["I tried but failed.", "It''s small but powerful."]'),
('although', 'contrast', 'concession', 'neutral', 'B1', '["Although it''s difficult...", "Although I agree..."]'),
('despite', 'contrast', 'concession', 'neutral', 'B2', '["Despite the challenges...", "Despite being tired..."]'),

-- Cause and Effect markers
('therefore', 'cause_effect', 'showing result', 'formal', 'B2', '["Therefore, we conclude...", "It''s raining; therefore, take an umbrella."]'),
('consequently', 'cause_effect', 'showing consequence', 'formal', 'B2', '["Consequently, the project failed.", "He didn''t study; consequently, he failed."]'),
('as a result', 'cause_effect', 'showing result', 'neutral', 'B1', '["As a result, sales increased.", "As a result of the rain..."]'),
('because', 'cause_effect', 'showing reason', 'neutral', 'A2', '["Because it''s late...", "I''m happy because..."]'),
('so', 'cause_effect', 'basic result', 'informal', 'A2', '["I''m tired, so I''ll rest.", "It''s hot, so drink water."]'),

-- Sequence markers
('firstly', 'sequence', 'ordering ideas', 'formal', 'B1', '["Firstly, let me explain...", "Firstly, we need to..."]'),
('secondly', 'sequence', 'ordering ideas', 'formal', 'B1', '["Secondly, consider this...", "Secondly, the cost factor..."]'),
('finally', 'sequence', 'concluding sequence', 'neutral', 'A2', '["Finally, I''d like to say...", "Finally, we arrived."]'),
('then', 'sequence', 'basic sequence', 'neutral', 'A2', '["First do this, then that.", "I woke up, then had breakfast."]'),
('subsequently', 'sequence', 'following in time', 'formal', 'C1', '["Subsequently, the law changed.", "He resigned; subsequently, she took over."]'),

-- Example markers
('for example', 'example', 'introducing example', 'neutral', 'B1', '["For example, consider this case...", "Many fruits, for example, apples..."]'),
('for instance', 'example', 'introducing example', 'neutral', 'B1', '["For instance, in Japan...", "Take, for instance, the case of..."]'),
('such as', 'example', 'giving examples', 'neutral', 'B1', '["Foods such as pasta...", "Activities such as swimming..."]'),
('namely', 'example', 'specifying', 'formal', 'B2', '["Two factors, namely cost and time...", "The issue, namely funding..."]'),

-- Summary markers
('in conclusion', 'summary', 'concluding', 'formal', 'B2', '["In conclusion, I believe...", "In conclusion, the evidence shows..."]'),
('to sum up', 'summary', 'summarizing', 'neutral', 'B1', '["To sum up, we need...", "To sum up the main points..."]'),
('in summary', 'summary', 'summarizing', 'formal', 'B2', '["In summary, the findings suggest...", "In summary, three key factors..."]'),
('overall', 'summary', 'general conclusion', 'neutral', 'B1', '["Overall, it was successful.", "Overall, I agree with..."]'),

-- Opinion markers
('in my opinion', 'opinion', 'expressing view', 'neutral', 'B1', '["In my opinion, this is wrong.", "In my opinion, we should..."]'),
('I believe', 'opinion', 'expressing belief', 'neutral', 'A2', '["I believe that...", "I believe we can..."]'),
('personally', 'opinion', 'personal view', 'neutral', 'B1', '["Personally, I prefer...", "Personally, I think..."]'),
('arguably', 'opinion', 'debatable point', 'formal', 'C1', '["This is arguably the best...", "Arguably, the most important..."]');

-- =====================================================
-- SAMPLE CEFR WORD LEVELS
-- =====================================================
-- This is a small sample. In production, you would import
-- comprehensive CEFR-aligned vocabulary lists

INSERT INTO cefr_word_levels (word, cefr_level, pos_tag, word_family, example_sentences) VALUES
-- A1 Level Words
('hello', 'A1', 'interjection', '["hello", "hi"]', '["Hello, how are you?", "Say hello to your friend."]'),
('name', 'A1', 'noun', '["name", "named", "naming"]', '["What is your name?", "My name is John."]'),
('come', 'A1', 'verb', '["come", "comes", "coming", "came"]', '["Come here please.", "She comes every day."]'),
('go', 'A1', 'verb', '["go", "goes", "going", "went", "gone"]', '["I go to school.", "Let''s go home."]'),
('like', 'A1', 'verb', '["like", "likes", "liked", "liking"]', '["I like coffee.", "Do you like music?"]'),

-- A2 Level Words
('because', 'A2', 'conjunction', '["because"]', '["I''m late because of traffic.", "Because it''s raining, take an umbrella."]'),
('understand', 'A2', 'verb', '["understand", "understands", "understanding", "understood"]', '["I understand English.", "Do you understand the question?"]'),
('difficult', 'A2', 'adjective', '["difficult", "difficulty", "difficulties"]', '["This is difficult.", "Learning languages can be difficult."]'),
('important', 'A2', 'adjective', '["important", "importantly", "importance"]', '["This is very important.", "It''s important to study."]'),

-- B1 Level Words
('advantage', 'B1', 'noun', '["advantage", "advantages", "advantageous"]', '["The main advantage is...", "There are several advantages to this approach."]'),
('consider', 'B1', 'verb', '["consider", "considers", "considering", "considered", "consideration"]', '["Please consider my proposal.", "We need to consider all options."]'),
('achieve', 'B1', 'verb', '["achieve", "achieves", "achieving", "achieved", "achievement"]', '["We achieved our goal.", "To achieve success, work hard."]'),
('opportunity', 'B1', 'noun', '["opportunity", "opportunities"]', '["This is a great opportunity.", "We have many opportunities."]'),

-- B2 Level Words
('significantly', 'B2', 'adverb', '["significant", "significantly", "significance"]', '["Results improved significantly.", "This is significantly different."]'),
('comprehensive', 'B2', 'adjective', '["comprehensive", "comprehensively", "comprehension"]', '["A comprehensive analysis.", "We need a comprehensive solution."]'),
('implement', 'B2', 'verb', '["implement", "implements", "implementing", "implemented", "implementation"]', '["We will implement the plan.", "The implementation was successful."]'),

-- C1 Level Words
('albeit', 'C1', 'conjunction', '["albeit"]', '["The results, albeit preliminary, are promising.", "It''s expensive, albeit effective."]'),
('paradigm', 'C1', 'noun', '["paradigm", "paradigms", "paradigmatic"]', '["A new paradigm in education.", "This paradigm shift is significant."]'),
('nuanced', 'C1', 'adjective', '["nuance", "nuanced", "nuances"]', '["A nuanced understanding.", "The situation is more nuanced."]'),

-- C2 Level Words
('ubiquitous', 'C2', 'adjective', '["ubiquitous", "ubiquitously", "ubiquity"]', '["Smartphones are ubiquitous.", "The ubiquitous presence of technology."]'),
('dichotomy', 'C2', 'noun', '["dichotomy", "dichotomies", "dichotomous"]', '["The dichotomy between theory and practice.", "This false dichotomy..."]');

-- =====================================================
-- SAMPLE ACADEMIC WORD LIST (AWL)
-- =====================================================
-- Sample entries from the Academic Word List

INSERT INTO academic_word_list (word, headword, sublist, word_family) VALUES
-- Sublist 1 (most frequent academic words)
('analyze', 'analyze', 1, '["analyze", "analyzes", "analyzed", "analyzing", "analysis", "analyst", "analysts", "analytical", "analytically"]'),
('approach', 'approach', 1, '["approach", "approaches", "approached", "approaching", "approachable"]'),
('area', 'area', 1, '["area", "areas"]'),
('assess', 'assess', 1, '["assess", "assesses", "assessed", "assessing", "assessment", "assessments", "reassess", "reassessment"]'),
('assume', 'assume', 1, '["assume", "assumes", "assumed", "assuming", "assumption", "assumptions"]'),
('authority', 'authority', 1, '["authority", "authorities", "authoritative"]'),
('concept', 'concept', 1, '["concept", "concepts", "conception", "conceptual", "conceptually", "conceptualize", "conceptualization"]'),
('consist', 'consist', 1, '["consist", "consists", "consisted", "consisting", "consistency", "consistent", "consistently", "inconsistent", "inconsistency"]'),
('context', 'context', 1, '["context", "contexts", "contextual", "contextualize", "contextualizing"]'),
('create', 'create', 1, '["create", "creates", "created", "creating", "creation", "creations", "creative", "creatively", "creativity", "creator", "creators", "recreate"]'),

-- Sublist 2
('achieve', 'achieve', 2, '["achieve", "achieves", "achieved", "achieving", "achievement", "achievements", "achievable"]'),
('acquire', 'acquire', 2, '["acquire", "acquires", "acquired", "acquiring", "acquisition", "acquisitions"]'),
('compute', 'compute', 2, '["compute", "computes", "computed", "computing", "computation", "computational", "computer", "computers", "computerized"]'),
('conclude', 'conclude', 2, '["conclude", "concludes", "concluded", "concluding", "conclusion", "conclusions", "conclusive", "conclusively", "inconclusive"]'),
('conduct', 'conduct', 2, '["conduct", "conducts", "conducted", "conducting", "conduction"]'),

-- Sublist 3
('alternative', 'alternative', 3, '["alternative", "alternatives", "alternatively"]'),
('circumstance', 'circumstance', 3, '["circumstance", "circumstances", "circumstantial"]'),
('compensate', 'compensate', 3, '["compensate", "compensates", "compensated", "compensating", "compensation", "compensatory"]'),
('component', 'component', 3, '["component", "components", "componentry"]'),
('consent', 'consent', 3, '["consent", "consents", "consented", "consenting", "consensus"]'),

-- Sublist 4
('adequate', 'adequate', 4, '["adequate", "adequately", "adequacy", "inadequate", "inadequacy", "inadequately"]'),
('annual', 'annual', 4, '["annual", "annually"]'),
('apparent', 'apparent', 4, '["apparent", "apparently"]'),
('attitude', 'attitude', 4, '["attitude", "attitudes", "attitudinal"]'),
('attribute', 'attribute', 4, '["attribute", "attributes", "attributed", "attributing", "attribution", "attributable"]'),

-- Sublist 5
('academic', 'academic', 5, '["academic", "academics", "academically", "academia"]'),
('adjust', 'adjust', 5, '["adjust", "adjusts", "adjusted", "adjusting", "adjustment", "adjustments", "readjust", "readjustment"]'),
('alter', 'alter', 5, '["alter", "alters", "altered", "altering", "alteration", "alterations", "unaltered"]'),
('amend', 'amend', 5, '["amend", "amends", "amended", "amending", "amendment", "amendments"]'),
('aware', 'aware', 5, '["aware", "awareness", "unaware"]');

-- =====================================================
-- SAMPLE WORD FREQUENCY DATA
-- =====================================================
-- This is a small sample. In production, you would import
-- the full SUBTLEXus database

INSERT INTO word_frequency_database (word, frequency, frequency_per_million, log_frequency, word_rank, pos_tags) VALUES
-- Very high frequency words
('the', 29944024, 5884.02, 7.476, 1, '["DT"]'),
('be', 13151999, 2584.16, 7.119, 2, '["VB", "VBZ", "VBP", "VBD", "VBN", "VBG"]'),
('to', 13124251, 2579.27, 7.118, 3, '["TO", "IN"]'),
('of', 10343429, 2032.17, 7.015, 4, '["IN"]'),
('and', 10144200, 1993.71, 7.006, 5, '["CC"]'),
('a', 10070054, 1978.92, 7.003, 6, '["DT"]'),
('in', 8469404, 1664.00, 6.928, 7, '["IN"]'),
('that', 6603571, 1297.73, 6.820, 8, '["IN", "DT", "RB", "WDT"]'),
('have', 5901659, 1159.62, 6.771, 9, '["VB", "VBP", "VBZ", "VBD", "VBN"]'),
('I', 5824487, 1144.26, 6.765, 10, '["PRP"]'),

-- Medium frequency words
('computer', 17683, 3.47, 4.248, 2451, '["NN"]'),
('understand', 115438, 22.69, 5.062, 621, '["VB", "VBP", "VBZ"]'),
('difficult', 47431, 9.32, 4.676, 1245, '["JJ"]'),
('important', 89912, 17.67, 4.954, 756, '["JJ"]'),

-- Lower frequency words
('comprehension', 3241, 0.64, 3.511, 9834, '["NN"]'),
('paradigm', 2156, 0.42, 3.334, 13457, '["NN"]'),
('dichotomy', 412, 0.08, 2.615, 32189, '["NN"]'),
('ubiquitous', 892, 0.18, 2.950, 23456, '["JJ"]'),

-- Academic/technical words
('analyze', 8234, 1.62, 3.916, 5234, '["VB", "VBZ"]'),
('hypothesis', 4567, 0.90, 3.660, 8901, '["NN"]'),
('methodology', 3456, 0.68, 3.539, 9234, '["NN"]'),
('significant', 23456, 4.61, 4.370, 2134, '["JJ"]'),
('correlation', 2345, 0.46, 3.370, 11234, '["NN"]');

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check discourse markers
SELECT category, COUNT(*) as count 
FROM discourse_markers 
GROUP BY category 
ORDER BY category;

-- Check CEFR word distribution
SELECT cefr_level, COUNT(*) as count 
FROM cefr_word_levels 
GROUP BY cefr_level 
ORDER BY cefr_level;

-- Check AWL sublists
SELECT sublist, COUNT(*) as count 
FROM academic_word_list 
GROUP BY sublist 
ORDER BY sublist;

-- Check word frequency ranges
SELECT 
    CASE 
        WHEN frequency_per_million >= 1000 THEN 'Very High (1000+)'
        WHEN frequency_per_million >= 100 THEN 'High (100-999)'
        WHEN frequency_per_million >= 10 THEN 'Medium (10-99)'
        WHEN frequency_per_million >= 1 THEN 'Low (1-9)'
        ELSE 'Very Low (<1)'
    END as frequency_range,
    COUNT(*) as word_count
FROM word_frequency_database
GROUP BY frequency_range
ORDER BY MIN(frequency_per_million) DESC;

-- =====================================================
-- SEED DATA COMPLETE
-- =====================================================
-- Reference tables now contain sample linguistic data
-- In production, import complete datasets from:
-- - SUBTLEXus for word frequencies
-- - Complete Academic Word List
-- - Comprehensive CEFR vocabulary lists
-- - Full discourse marker references
-- =====================================================