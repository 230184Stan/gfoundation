-- =====================================================================
-- Gamuna Foundation — starting content (run AFTER schema.sql)
-- Safe to re-run: it clears these tables and re-inserts the content.
-- =====================================================================

truncate public.pillars, public.programs, public.events, public.news, public.team_members;

insert into public.site_settings (key, value) values
('general', $${
  "org_name": "Gamuna Foundation",
  "representative": "Nicholas Gamuna",
  "email": "stanissika@outlook.com",
  "phone": "(675) 7988 8330",
  "location": "Madang Province, Papua New Guinea",
  "facebook_url": "https://www.facebook.com/profile.php?id=61585581315098"
}$$::jsonb),
('home', $${
  "eyebrow": "Est. 2026 · Madang Province, PNG",
  "title": "Advocate\nMotivate\nInspire",
  "subtitle": "Empowering the youth of Papua New Guinea through education, advocacy, and community action.",
  "mission_quote": "To empower young people through education, advocacy, and community engagement, enabling them to overcome challenges and achieve their full potential."
}$$::jsonb),
('about', $${
  "vision": "To create a vibrant and empowered generation of young leaders and communities who contribute positively to society, fostering sustainable development and community resilience in Madang and in Papua New Guinea.",
  "mission": "To empower young people through education, advocacy, and community engagement, enabling them to overcome challenges and achieve their full potential.",
  "location_text": "We operate in the heart of Madang Province, Papua New Guinea, engaging directly with both urban and rural communities to understand their unique challenges."
}$$::jsonb),
('partners', $${
  "text": "We actively collaborate with international organizations, local governments, and community stakeholders — including the European Union and Digicel Foundation — to maximize impact and foster sustainable development."
}$$::jsonb)
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.pillars (icon, title, description, sort_order) values
('✊', 'Youth Empowerment', $$Skills training, leadership workshops, and mentorship programs that unlock every young person's potential.$$, 10),
('📢', 'Advocacy', $$Amplifying youth voices in local and national conversations, and connecting with global standards.$$, 20),
('🌟', 'Motivation & Inspiration', $$Seminars, outreach, and storytelling platforms that inspire young people to dream bigger.$$, 30),
('🤝', 'Community Development', $$Service projects, local partnerships, and internships that connect youth to real opportunities.$$, 40);

insert into public.programs (title, description, sort_order) values
('Awareness Programs', $$Community outreach sessions covering health and hygiene, education, employment pathways, law and order, and "gutpela sidaun" (good living). We bring information directly to urban and rural communities across Madang Province.$$, 10),
('Workshops & Training', $$Hands-on skill-building sessions in leadership, entrepreneurship, and personal development — facilitated by our Training Committee and subject-matter experts.$$, 20),
('Mentorship & Confidence Building', $$One-on-one and group mentorship programs that foster self-worth among young people, with community involvement at the core of every interaction.$$, 30),
('Motivational Events & Seminars', $$Inspiring gatherings where youth share success stories, hear from role models, and build a supportive peer network that replaces negative influences with positive direction.$$, 40),
('Community Service Projects', $$Youth-led initiatives that promote social responsibility and environmental stewardship, partnering with local businesses to create internships and job pathways.$$, 50),
('Donation Drives', $$Coordinated drives to collect and distribute resources to vulnerable community members, building a culture of generosity and mutual support.$$, 60);

insert into public.events (title, description, event_date, badge, location, time_label, outcome) values
('Youth Leadership & Entrepreneurship Training', $$A full-day hands-on workshop covering leadership fundamentals, basic business planning, and personal goal setting for young people aged 15–30.$$, '2026-08-15', 'workshop', 'Madang Community Hall, Madang Town', '9:00 AM – 4:00 PM', null),
('Health & Hygiene Awareness Drive', $$Community awareness session on health, hygiene, and sanitation practices targeting rural settlements in Madang Province.$$, '2026-09-06', 'outreach', 'Transgogol Village, Madang', '8:00 AM – 12:00 PM', null),
('Motivational Youth Seminar', $$An inspiring seminar featuring local role models and youth speakers sharing their journeys, encouraging peers to pursue education and stay away from negative influences.$$, '2026-10-20', 'seminar', 'Divine Word University, Madang', '10:00 AM – 3:00 PM', null),
('Gamuna Foundation Official Launch', $$The official founding and launch of the Gamuna Foundation, marking the beginning of our mission to advocate, motivate, and inspire the youth of Papua New Guinea.$$, '2026-06-21', 'launch', 'Madang Province, Papua New Guinea', null, 'Successfully launched with founding members');

insert into public.news (title, body, tag, published_on, date_label, source_url, source_label) values
('Gamuna Foundation Launches News & Updates Page', $$We've added this space to keep our community informed between events — announcements, partnership news, media coverage, and behind-the-scenes updates on our work across Madang Province.$$, 'Announcement', '2026-07-22', 'July 22, 2026', null, null),
('Kalibobo Secondhand Supports Gamuna Foundation Outreach', $$Kalibobo Secondhand in Madang donated three bales of secondhand clothing to support the foundation's upcoming community outreach program, with the items set to be distributed to families in need across Madang Province. Founder Nicholas Gamuna thanked the business for the support, while Kalibobo Secondhand Team Leader William Sony encouraged more young people and community groups to work together to make a positive difference across the province.$$, 'Media Coverage', '2026-07-15', 'July 2026', 'https://emtv.com.pg/kalibobo-secondhand-supports-gamuna-foundation-outreach/', 'Read more at EMTV Online'),
('DWU Students, Student Rep Council & Gamuna Foundation Team Up for Community Outreach', $$Students from Divine Word University, the Student Representative Council, and the Gamuna Foundation joined forces on a donation drive and awareness programme for local communities. Founder Nicholas Gamuna spoke on the importance of respecting laws and keeping communities informed of civic responsibilities, with the group committing to continue awareness campaigns focused on the challenges facing today's youth.$$, 'Media Coverage', '2026-05-21', 'May 21, 2026', 'https://www.thenational.com.pg/university-students-support-communities-through-donationdrives-and-awareness-programmes/', 'Read more at The National'),
('The Story Behind the Gamuna Foundation', $$A feature piece traced the foundation's roots to founder Nicholas Gamuna's final year studying Social and Religious Studies at Divine Word University, and his time as DWU Madang Students Association President in 2025, where he saw firsthand the challenges facing local youth. The foundation is built on the idea of Holistic Human Development — nurturing people's physical, emotional, social, and spiritual wellbeing — and runs programmes spanning awareness campaigns on gender-based violence, law and order, health and education, plus a youth-led community policing initiative in the Sumkar District. The piece also noted a Donation Drive running from May 9th through the end of the month.$$, 'Feature Story', '2026-05-10', 'May 2026', 'https://pnghausbung.com/the-gamuna-foundation--a-holistic-mission-to-serve/', 'Read more at PNG Haus Bung'),
('Gamuna Foundation Visits Beon Prison, Madang', $$Members of the Gamuna Foundation visited inmates at Beon Prison in Madang, carrying out awareness activities and donating clothes, food and drinks. Founder Nicholas Gamuna said the prison was chosen so youth in the programme could witness firsthand the consequences of crime, engage with inmates, and share messages of hope — reinforcing that there is always an opportunity to change and become a better person after prison.$$, 'Media Coverage', '2026-02-15', 'February 2026', 'https://www.thenational.com.pg/prison-visit-makes-a-difference/', 'Read more at The National');

-- photo_url is null where no photo file existed in the old site (a placeholder shows instead);
-- upload photos later from the admin dashboard.
insert into public.team_members (name, role, photo_url, group_name, sort_order) values
('Nicholas Gamuna', 'President', '/assets/team/nicholas-gamuna.jpg', 'executive', 10),
('Cornelius Javangu', 'Male Vice President', '/assets/team/cornelius-javangu.jpg', 'executive', 20),
('Amy Michael', 'Female Vice President', '/assets/team/amy-michael.jpg', 'executive', 30),
('Willie Gamuna', 'Patron', '/assets/team/willie-gamuna.jpg', 'executive', 40),
('Narisha Asoh', 'Secretary', '/assets/team/narisha-asoh.jpg', 'executive', 50),
('Noel Silari', 'Assistant Secretary', null, 'executive', 60),
('Raphaella Wanam', 'Treasurer', '/assets/team/raphaella-wanam.jpg', 'executive', 70),
('Rudolf Boagin', 'Assistant Treasurer', '/assets/team/rudolf-boagin.jpg', 'executive', 80),
('Tailasa Minel', 'Chairperson', '/assets/team/tailasa-minel.jpg', 'executive', 90),
('Allan Mulido', 'Assistant Chairperson', '/assets/team/allan-mulido.jpg', 'executive', 100),
('Mackeilla Solomon Maniura', 'Project & Planning Officer', '/assets/team/mackeilla-solomon-maniura.jpg', 'executive', 110),
('Roger Jacob', 'Events Representative', null, 'executive', 120),
('Sr. Joan Lihami', 'Spiritual Mentor', '/assets/team/joan-lihami.jpg', 'executive', 130),
('Hendrina Igag', 'Media Representative', '/assets/team/hendrina-igag.jpg', 'executive', 140),
('Jeremy Soalili', 'Fundraising Representative', null, 'executive', 150),
('Dunstan Igag', 'Assistant Fundraising Representative', null, 'executive', 160),
('Ruby Matane', 'Training Committee', null, 'training', 10),
('Henry Agavi', 'Training Committee', null, 'training', 20);
