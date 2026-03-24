<header class="guide-header">
  <img src="/images/threatmodelcover.jpg" alt="" class="guide-cover">
  <h1>Reclaim your Privacy | Part 1: Threat Modelling</h1>
  <time datetime="2024-01-08">8 January 2024</time>
  <p class="guide-series">Part 1 of 3 in the <strong>Reclaim your Privacy</strong> series</p>
</header>

<h3>1. Down the Rabbit Hole</h3>

<p>If you are reading this post it is safe to assume that you are interested, to some degree, in protecting your personal privacy and security (PrivSec) in our age of hyper-digitization.</p>

<p>Strategies to protect your online PrivSec are constantly evolving. Misinformation, conflicting advice and inadequate recommendations of counter-measures to state and private surveillance are rife on the internet, particularly within privacy-focused communities online. Rather than focus on specific software and hardware that you can use to manage your PrivSec, this blog post will focus on establishing and maintaining an effective threat model tailored to your distinct needs as an individual.</p>

<h3>2. A 3 Tiered Series of Posts</h3>

<p>There will be 2 further posts as part of this 3 part series. I have broken down the steps you can take into 3 distinct tiers, each with its own post, which vary in the effort, time and research for you to implement in practice. These will be:</p>

<ol>
  <li>This post - how to create a threat model and actionable privacy and security management strategy</li>
  <li>A security guide for the average internet user</li>
  <li>A privacy guide for those seeking to regain their fundamental right to privacy online</li>
</ol>

<p>The steps that you will take to enhance your digital security and privacy will depend on your personal threat model and your action plan will not fit into any of the three perfectly.</p>

<p>It is all to common in digital privacy related online communities to see such questions along the lines of: "what is the most private email service?" or "should I use Tor?" with varying misinformed answers being given. Such questions are extremely vague with no clear cut answer as privacy solutions will differ based on your personal digital needs. It must be remembered that digital privacy (and anonymity) and security is a spectrum. The recommended actions for an ordinary person who wants greater security from the myriad of threats online will differ from someone who opposes the current model of ubiquitous state/ corporate surveillance and even more significantly from a dissident journalist for example. See below for a serious representation of this spectrum.</p>

<img src="/images/ericmurphyprivspectrum.jpg" alt="Privacy Spectrum">
<p class="img-credit">Credit goes to <a href="https://www.youtube.com/watch?v=H414XdcbC4Q" target="_blank" rel="noopener noreferrer">Eric Murphy</a></p>

<p>I should stress that you should avoid going too hard too fast. By this I mean you should not go completely down the rabbit hole, use Tor exclusively, nuke your social media accounts and retire to a cabin in the woods donning a tinfoil hat. This will lead to you burning out from the sheer scope of trying to become 100% anonymous online (you cant); reading and researching mountains of conflicting recommendations online and the constant inconveniences from the software and services you would give up. Most of those who choose to pursue digital privacy, security and anonymity in this way will inevitably give up and become disillusioned, returning to their old internet habits. This is why threat modelling is so important as a vital first step to begin your privacy journey as you will soon discover.</p>

<h3>3. Threat Modelling: 101</h3>

<h4>3.1 Why Threat Model?</h4>

<p>Protecting your digital data in today's age of hyper connectivity can be tiresome and disorientating. It seems like almost every other day that your personal data is being exposed from services and software that you use <a href="https://www.reuters.com/technology/twitter-hacked-200-million-user-email-addresses-leaked-researcher-says-2023-01-05/" target="_blank" rel="noopener noreferrer">everyday</a> in numerous <a href="https://www.infosecurity-magazine.com/news/toyota-data-leak-customers/" target="_blank" rel="noopener noreferrer">data breaches</a>. <a href="https://www.nytimes.com/2023/01/05/technology/personaltech/lastpass-breach-password-safety.html" target="_blank" rel="noopener noreferrer">Services</a> and <a href="https://www.businessinsider.nl/hacker-breaks-into-smart-home-google-nest-devices-terrorizes-couple-2019-9?international=true&r=US" target="_blank" rel="noopener noreferrer">hardware</a> that are supposedly privacy and security respecting turn out to be <a href="https://www.wsj.com/video/how-the-fbi-tricked-suspects-into-using-messaging-platform-anom/D5A9F66A-A9FF-4BCA-BEFD-3215D674CF2C.html" target="_blank" rel="noopener noreferrer">compromised</a>, become <a href="https://github.com/gorhill/uMatrix" target="_blank" rel="noopener noreferrer">outdated</a>, <a href="https://fossbytes.com/duckduckgo-allows-microsoft-trackers/" target="_blank" rel="noopener noreferrer">do not adequately inform their users</a> about privacy protections or were <a href="https://www.cnet.com/tech/services-and-software/why-you-should-be-skeptical-about-a-vpns-no-logs-claims/" target="_blank" rel="noopener noreferrer">never that secure</a> to <a href="https://www.vice.com/en/article/gvzw5x/secure-messaging-app-wire-stores-everyone-youve-ever-contacted-in-plain-text" target="_blank" rel="noopener noreferrer">begin with</a>. Navigating this ever evolving landscape is confusing and there is no fault in feeling that. For example the DuckDuckGo search engine can still, as of this posts date, be trusted however <a href="https://arstechnica.com/gadgets/2022/08/microsoft-trackers-run-afoul-of-duckduckgo-get-added-to-blocklist/" target="_blank" rel="noopener noreferrer">until very recently</a> the browser could not be recommended from a privacy point of view due to allowing Microsoft trackers without express user consent or knowledge. This case illustrates that simply relying on specific services is a flawed way to maintain and protect your personal PrivSec and that something more is needed, namely a comprehensive privacy and security management strategy: <a href="https://www.cisco.com/c/en/us/products/security/what-is-threat-modeling.html" target="_blank" rel="noopener noreferrer">a threat model</a>.</p>

<h4>3.2 What is a Threat Model?</h4>

<p>In essence a <a href="https://ssd.eff.org/glossary/threat-model" target="_blank" rel="noopener noreferrer">threat model</a> is a comprehensive plan, or management strategy, that at its core aims to identify what your digital assets are, who your threats are and how you should go about protecting said assets from said threats.</p>

<p>The concept of threat modelling is <a href="https://owasp.org/www-community/Threat_Modeling" target="_blank" rel="noopener noreferrer">widely used</a> in the cyber-security field and for good reason. Threats change and so do the tools needed to counteract them. Nothing is ever 100% secure. What is needed is a specific tailored methodology that is as rigorous as you need it to be.</p>

<h3>4. PrivSec Fundamentals</h3>

<p>Before I delve into the process of creating a threat model, I will go over some basic fundamental knowledge covering some key terminology. If you are more technically adept or already have knowledge in this field feel free to skip this part of the post.</p>

<p><strong>Security, Privacy and Anonymity:</strong> These three terms often get conflated but they differ substantially.</p>

<ul>
  <li><strong>Security</strong> can be described simply as efforts to keep your data secure from malicious third parties. What you define as a malicious third party would depend on your specific threat model.</li>
  <li><strong>Privacy</strong> can be defined as keeping elements of your <a href="https://proton.me/blog/anonymity-vs-privacy" target="_blank" rel="noopener noreferrer">digital life to yourself</a>, for example, using an end-to-end encrypted messaging service in which the content of what you send is only accessible by you and the recipient.</li>
  <li>A real world example: Google is renowned for having among the best security for its users. However, your data is not private from Google itself. If avoiding state bulk collection and surveillance capitalism is a part of your threat model, using Google services would be <a href="https://www.eff.org/deeplinks/2013/03/new-statistics-about-national-security-letters-google-transparency-report" target="_blank" rel="noopener noreferrer">deemed as insecure</a>.</li>
  <li><strong>Anonymity</strong> is described as the decoupling of your real identity from your online actions. An example of this would be utilizing the Tor Network.</li>
  <li><strong>Further reading:</strong> <a href="https://www.businesstechweekly.com/cybersecurity/data-security/security-privacy/" target="_blank" rel="noopener noreferrer">Security vs. Privacy vs. Anonymity</a></li>
</ul>

<p><strong>Adversary:</strong> An online actor that you want to protect your digital data from.</p>

<p><strong>Targeted Attacks:</strong> These refer to attacks by malicious parties such as hackers that attempt to gain access to <em>specifically your</em> digital data and devices.</p>

<p><strong>Passive Attacks:</strong> These refer to events and attacks such as widely proliferated malware, database breaches and hacks that affect and are targeted at <em>multiple people and companies</em>.</p>

<p><strong>Service Providers:</strong> These are the entities that act as your gate-keeper to the internet, such as your search engine and browser, email provider, ISP, communication provider and many more.</p>

<p><strong>Doxing:</strong> 'Doxing' or public exposure refers to having your personal information available to the public at large online.</p>

<p><strong>Mass surveillance:</strong> The bulk data collection programs operated by law enforcement and intelligence agencies across the world.</p>

<p><strong>Surveillance capitalism:</strong> The current revenue model on the internet of the collection and processing of individual's personal data by tech corporations and data brokers for the purpose of profit, typically seen through the use of highly personalized advertising.</p>

<p><strong>Assets:</strong> The elements of your digital life that you want to protect.</p>

<p><strong>Threats:</strong> The entities that you want to protect your assets from.</p>

<h3>5. Establishing an Effective Threat Model</h3>

<p>Establishing your effective PrivSec threat model revolves around five key questions. It is important to take your time in thoroughly answering them, taking heed what it is exactly that you want out of your efforts.</p>

<h4>5.1 What is it Exactly That You Want to Protect?</h4>

<p>First you will need to figure out what elements of your digital life, or assets, you want to put effort in protecting. These assets can be limited to certain sensitive parts of your digital identity such as an anonymous messaging account or your search engine queries or more generally encompass all the personal digital information that you produce by nature of being connected online.</p>

<p>In order to do this I would advise making a list:</p>

<ol>
  <li>Identifying your assets that you want to protect</li>
  <li>Identifying where it is stored</li>
  <li>Identifying who has access to it</li>
  <li>Identifying what stops others from accessing it</li>
</ol>

<p>The digital data that you produce is generally split into two classes: <strong>content</strong> and <strong>metadata</strong> and you should, when making a list of your assets, factor in this categorization.</p>

<p>Content refers to your actual digital content, whether it be the words used in a message or a post online while metadata refers to data about data, including but not limited to I.P addresses, geo-location data and the 'URLs' of websites you visit online. Neither is more important than the other from a PrivSec viewpoint, <a href="https://www.youtube.com/watch?v=HO6fNDMGRmg" target="_blank" rel="noopener noreferrer">as is often touted</a>, as both types of data about you can paint an intimate picture about your life. The ability of metadata to provide actionable information about an individual is clearly elucidated by former NSA and CIA director General Michael Hayden when he testified to Congress: <a href="https://abcnews.go.com/blogs/headlines/2014/05/ex-nsa-chief-we-kill-people-based-on-metadata" target="_blank" rel="noopener noreferrer">"we kill people based on metadata."</a></p>

<p>Depending on the level of effort you personally want to invest you may want to create a diagram including what entities have your personal data, where this data is stored and what third parties it can be shared with as seen below. I would recommend using <a href="https://tosdr.org/" target="_blank" rel="noopener noreferrer">'Terms of Service; Didn't Read'</a> for this unless you enjoy sifting through legalese. I won't judge ;). Such an index of your data will help you see if the data collected by an entity is truly necessary and proportional to its purposes.</p>

<img src="/images/threatmodelentitydatatable.jpg" alt="Entity data table showing what data entities collect">

<h4>5.2 What do You Want to Protect it From?</h4>

<p>The next stage of creating your personal threat model involves sorting out and identifying exactly who and what your threat adversaries are. Depending on whether your aim is security, privacy or anonymity this step will differ radically from person to person.</p>

<p>For simplicity's sake threat actors/ adversaries can be divided into three groups:</p>

<ol>
  <li><strong>External Adversaries:</strong> Threat actors external to the systems you use, such as hackers, criminal groups or state institutions.</li>
  <li><strong>Organizational Adversaries:</strong> Entities, such as a company or service provider you use, which manages your data in ways in which you do not approve. This also covers <a href="https://www.telegraph.co.uk/news/2021/07/12/exclusive-extract-facebooks-engineers-spied-women/" target="_blank" rel="noopener noreferrer">rogue employees</a> abusing your personal data.</li>
  <li><strong>Receiving Parties:</strong> Entities that can have your personal data shared to them, or the receiving end of your communications.</li>
</ol>

<p>Once you have done this it is time to move onto the sub-step of what threats you want to protect your data from. This is where the <a href="https://www.linddun.org/linddun-go-categories" target="_blank" rel="noopener noreferrer">LINDDUN</a> model of privacy/ security threats proves highly useful.</p>

<p><strong>Linkability:</strong> The ability of an adversary to "sufficiently distinguish whether two IOI [items of interest] are linked or not, even without knowing the actual identity of the subject of the linkable IOI". An example would be using the same login credentials across multiple different services. This can lead to inferences, singling out and identifiability which <a href="https://www.justsecurity.org/81547/with-roe-v-wade-at-risk-digital-surveillance-threatens-reproductive-freedom/" target="_blank" rel="noopener noreferrer">can</a> and <a href="https://www.forbes.com/sites/thomasbrewster/2021/10/04/google-keyword-warrants-give-us-government-data-on-search-users/" target="_blank" rel="noopener noreferrer">has</a> lead to unwanted potentially <a href="https://tcf.org/content/report/disparate-impact-surveillance/" target="_blank" rel="noopener noreferrer">discriminatory practices</a>.</p>

<p><strong>Identifiability:</strong> The capability of an adversary to "sufficiently identify the subject within a set of subjects". This occurs when "data items can be linked to the identity of the data subject, with a certain probability."</p>

<p><strong>Non-Repudiation:</strong> Privacy and security goals can, on occasion, come into conflict with each other. Put simply non-repudiation is when a "data subject cannot deny they know, have done or have said something." For things like online banking this is vital for security. However, for other things "non repudiation leads to data subject accountability: when a person is not able to be repudiate an action or piece of information, he can be held accountable (e.g. a whistleblower can be prosecuted)".</p>

<p><strong>Detectability:</strong> Under certain threat models the outright presence of a piece of data can be an issue regardless of the protections afforded to it. Detectability can result in the "deduction of personal data" and be used to "extend a data subject's profile (linkability) and/ or identify the data subject".</p>

<p><strong>Unawareness:</strong> User unawareness is one of the biggest threats to an individual's security and privacy. When a data subject is "unaware if, or unable to intervene in, the collection and further processing of their personal data" the end result can lead to a violation of their fundamental rights. This happens through:</p>

<ol>
  <li><strong>Lack of transparency/ predictability:</strong> if "a data subject is unaware of collection and/ or processing of personal data related to them."</li>
  <li><strong>Lack of intervenability:</strong> if "a data subject cannot access or manage their own personal data (including managing access settings)."</li>
</ol>

<p>In order to avoid this scenario of unawareness I would advise your PrivSec management strategy be supported by rudimentary research asking:</p>

<ul>
  <li>Are you adequately informed about the collection and further processing of your personal data?</li>
  <li>Does the service you are utilizing provide user-friendly privacy controls with privacy by design/ default settings?</li>
  <li>Does the service you use provide an easy to use way to request, change and/ or remove your personal data?</li>
  <li>Does the service you are using require your informed consent before any data is collected or processed and can this consent be easily withdrawn?</li>
</ul>

<p><strong>Non-Compliance:</strong> The final category focuses on basic data protection principles:</p>

<ul>
  <li><strong>Purpose limitation:</strong> A service provider should only collect and process data for an express predetermined purpose.</li>
  <li><strong>Proportionality:</strong> A service provider should only collect and process the amount of data required for the purpose (data minimization)</li>
  <li><strong>Storage limitation:</strong> A service provider should only store data for as long is strictly necessary for the purpose</li>
</ul>

<p>Again a diagram can prove very useful. I would also highly recommend you 'play' <a href="https://www.linddun.org/go" target="_blank" rel="noopener noreferrer">LINDDUN GO</a> while doing this for a complete, fully exhaustive, intuitive and easy to follow experience.</p>

<img src="/images/linduntable.png" alt="LINDDUN threat assessment table">

<h4>5.3 How Likely is it That you Will Need to Protect it?</h4>

<p>This stage revolves around the ideas of risk, threats and capabilities. You should list the threats you are going to treat seriously and those that are too harmless or rare to worry about.</p>

<blockquote>
  <p>"the likelihood that a particular threat against a particular asset will actually occur. It goes hand-in-hand with capability. While your mobile phone provider has the capability to access all of your data, the risk of them posting your private data online to harm your reputation is low." <em>-EFF's Surveillance Self-Defense</em></p>
</blockquote>

<p>An important note: assessing risk is highly subjective and personal. What one person may deem as an acceptable amount of risk may be unacceptable to you based on your threat model.</p>

<h4>5.4 What are the Consequences of Failure?</h4>

<p>This stage asks what are the potential ramifications of a breach to your threat model. You should note down and list what adversaries could do with your data.</p>

<blockquote>
  <p>"Security planning involves understanding how bad the consequences could be if an adversary successfully gains access to one of your assets. To determine this, you should consider the <a href="https://ssd.eff.org/glossary/capability" target="_blank" rel="noopener noreferrer">capability</a> of your adversary." <em>-EFF's Surveillance Self-Defense</em></p>
</blockquote>

<h4>5.5 How Much Effort are You Willing to go Through to Mitigate the Threats and Consequences?</h4>

<p>The amount of time, effort and resources you are willing to dedicate will primarily be determined by steps three and four. For example a lawyer or journalist working on matters related to national security will have a considerably different and more exhaustive threat model than a family member who regularly posts amusing videos online.</p>

<p>Once you have completed this stage you would have successfully created a personally tailored threat model!</p>

<p><strong>The next step would be to mitigate these threats that you identified. This will be done in the follow up posts to this series!</strong></p>

<h3>6. Every Threat Model is Different</h3>

<p>I can't stress enough that every individual's PrivSec threat model is different. All these steps are not necessarily to be taken in order as they are all highly interconnected and inter-related. It is my hope that this post has proven useful and informative to you and has offered a decent introductory guide into how to effectively establish a personal privacy and security management strategy.</p>

<h3>7. Main Sources Used</h3>

<ul>
  <li><a href="https://ssd.eff.org/" target="_blank" rel="noopener noreferrer">EFF's Surveillance Self-Defense</a></li>
  <li><a href="https://www.privacyguides.org/" target="_blank" rel="noopener noreferrer">PrivacyGuides</a></li>
  <li><a href="https://www.linddun.org/" target="_blank" rel="noopener noreferrer">LINDDUN</a></li>
  <li><a href="https://www.threatmodelingmanifesto.org/" target="_blank" rel="noopener noreferrer">Threat Modeling Manifesto</a></li>
  <li><a href="https://www.youtube.com/watch?v=6AXkJ3dot2s" target="_blank" rel="noopener noreferrer">How To Protect Your Online Privacy With A Threat Model | Tutorial 2022</a>, The Hated One, YouTube</li>
</ul>

<hr>
<p class="guide-quote"><em>"Security is a process, not a product."</em> <strong>-Bruce Schneier</strong></p>
<hr>
