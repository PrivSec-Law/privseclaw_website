<header class="guide-header">
  <img src="/images/facebookwatchingscreen.jpg" alt="" class="guide-cover">
  <h1>Reclaim your Privacy | Part 3: Escaping the Privacy Paradox</h1>
  <time datetime="2024-04-04">4 April 2024</time>
  <p class="guide-series">Part 3 of 3 in the <strong>Reclaim your Privacy</strong> series</p>
</header>

<h3>1. The Private Individual</h3>

<p>Are you growing concerned about the increasing concentration, consolidation, and expansion of informational power in the hands of seemingly unaccountable technology corporations and state actors? Do you wish to mitigate the sense of constant digital surveillance and monitoring every day? If so, let this post act as an introductory guide for you.</p>

<p>If you have not already, I would highly advise checking out the previous two posts in this series: <a href="/blog/threat-modelling">Part 1: Threat Modelling</a> and <a href="/blog/digital-security">Part 2: Digital Security</a>.</p>

<p>I cannot stress enough that you don't have to implement all of the steps found within these guides. Remember: any step taken towards protecting your digital privacy is worthwhile, but not every step may be worthwhile to you. Always keep in mind your threat model and what exactly you are trying to achieve.</p>

<h3>2. User Control</h3>

<p>Ultimately, it is my opinion that digital privacy is fundamentally underpinned by the notion of user control. Many of the recommendations within this introductory guide will not only serve to increase your privacy but also unshackle you from the exploitative surveillance capitalistic business model that drives the modern internet.</p>

<blockquote>
  <p><em>Control does not guarantee privacy but it is an absolute imperative. Privacy cannot be given, it can only be taken.</em></p>
  <p><a href="https://www.youtube.com/watch?v=nQ9LR8homt4" target="_blank" rel="noopener noreferrer">-The Hated One</a></p>
</blockquote>

<h3>3. Back to LINDDUN</h3>

<p>Applying the LINDDUN threat model is a must if you want to effectively use the below recommendations. For more detail I refer you to the <a href="/blog/threat-modelling">first post in this series</a>.</p>

<p><strong>Linkability:</strong> Prevent the different aspects of your digital life from being linked with each other. Use email aliasing instead of reusing the same email address.</p>

<p><strong>Identifiability:</strong> Avoid having your real world identity linked to the data that you produce.</p>

<p><strong>Non-Repudiation:</strong> Privacy and security goals can come into conflict. Consider whether you need 'plausible deniability'.</p>

<p><strong>Detectability:</strong> Under certain threat models the outright presence of a piece of data can be an issue regardless of protections.</p>

<p><strong>Unawareness:</strong> Often it is the user themselves that poses the biggest threat through unawareness of risks.</p>

<p><strong>Non-Compliance:</strong> Assess whether services adhere to purpose limitation, proportionality, and storage limitation principles.</p>

<h3>4. Mobile Recommendations</h3>

<h4>4.1 Use a Secure and Privacy Respecting Mobile Operating System</h4>

<h5>4.1.1 Iphone Recommendations</h5>

<p>While Apple has pushed heavily to create a brand image of respecting privacy the reality is much more nuanced. I would highly recommend the below video for reference.</p>

<div class="youtube-placeholder" data-video-id="nQ9LR8homt4">
  <img src="https://img.youtube.com/vi/nQ9LR8homt4/maxresdefault.jpg" alt="Video thumbnail" class="youtube-thumb">
  <button class="youtube-play-btn" aria-label="Play video">
    <svg viewBox="0 0 68 48"><path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="red"/><path d="M45 24L27 14v20" fill="white"/></svg>
  </button>
</div>

<p>If you decide to stick with IOS I would recommend following <a href="https://www.privacyguides.org/en/os/ios-overview/" target="_blank" rel="noopener noreferrer">this configuration page on Privacy Guides</a>.</p>

<h5>4.1.2 Android Recommendations</h5>

<p>It is very hard to recommend a stock OEM Android operating system. The versions of Android installed on end user devices are a complete privacy nightmare with invasive Google Play Services baked in.</p>

<blockquote>
  <p>When you buy an Android phone, the default operating system comes bundled with apps and functionality that are not part of the Android Open Source Project. Frameworks like Google Play Services increase the attack surface of your device and are the source of various privacy concerns. - <a href="https://www.privacyguides.org/en/os/android-overview/" target="_blank" rel="noopener noreferrer">Privacy Guides</a></p>
</blockquote>

<p>However there is an exception: installing a custom Android operating system. Recommended options:</p>

<ol>
  <li><a href="https://grapheneos.org/" target="_blank" rel="noopener noreferrer">GrapheneOS</a></li>
  <li><a href="http://divestos.org" target="_blank" rel="noopener noreferrer">DivestOS</a></li>
  <li><a href="https://lineageos.org/" target="_blank" rel="noopener noreferrer">LineageOS</a></li>
</ol>

<p><a href="https://grapheneos.org/" target="_blank" rel="noopener noreferrer">GrapheneOS</a> is what I would strongly recommend. It has the gold standard of mobile security, <a href="https://x.com/Snowden/status/1588472045960327168" target="_blank" rel="noopener noreferrer">recommended by Edward Snowden</a>, and beating IOS and stock Android against <a href="https://x.com/GrapheneOS/status/1791833221165965567" target="_blank" rel="noopener noreferrer">Cellebrite attacks</a>.</p>

<h4>4.2 End-to-end Encrypted Communications is a Must!</h4>

<p>Using end to end encryption (E2EE) for your digital communications is a must. See below for a great illustration of how E2EE works.</p>

<div class="youtube-placeholder" data-video-id="c2OkOckSD20">
  <img src="https://img.youtube.com/vi/c2OkOckSD20/maxresdefault.jpg" alt="Video thumbnail" class="youtube-thumb">
  <button class="youtube-play-btn" aria-label="Play video">
    <svg viewBox="0 0 68 48"><path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="red"/><path d="M45 24L27 14v20" fill="white"/></svg>
  </button>
</div>

<p>You may want to shift your conversations to <a href="https://signal.org/" target="_blank" rel="noopener noreferrer">Signal</a>. While WhatsApp is also E2EE, Signal only collects your phone number, when you created your account and the time you last logged in as per this <a href="https://signal.org/bigbrother/cd-california-grand-jury/" target="_blank" rel="noopener noreferrer">US Federal Subpoena.</a></p>

<h4>4.3 Consider Cutting Out or Back on Your Social Media Accounts</h4>

<p>Consider cutting out Big Tech social media. These platforms track you across the internet. If you live within the EEA/ EU make sure you send in a GDPR right to be forgotten request if you choose to delete your accounts.</p>

<p>If you are unwilling to part ways, consider using fake information to create 'anonymous' accounts and only access these platforms through a privacy respecting browser.</p>

<h4>4.4 Use a Secure and Privacy Respecting Web Browser</h4>

<p>For mobile browsing I would recommend Brave Browser on Android or Safari on IOS with tweaks. See <a href="https://www.privacyguides.org/en/mobile-browsers/" target="_blank" rel="noopener noreferrer">Privacy Guides</a> for more.</p>

<h4>4.5 Consider Paying for your SIM in Cash</h4>

<p>If legally possible you may elect to use a prepaid number that you can top up with cash. Your mobile number will not be linked to your government identity.</p>

<h4>4.6 Pay Close Attention to Application Permissions</h4>

<p>Pay very close attention to the permissions that you allow applications to have. Ask yourself if an application really needs a permission.</p>

<p>GrapheneOS deserves a mention here &mdash; you can set up storage scopes, revoke Bluetooth, sensor and WiFi permissions amongst many other <a href="https://en.wikipedia.org/wiki/Sandbox_(computer_security)" target="_blank" rel="noopener noreferrer">sandboxing</a> features.</p>

<h4>4.7 Reduce your Attack Surface</h4>

<p>Limit the applications installed on your device. The more apps you have the larger your <a href="https://www.techtarget.com/whatis/definition/attack-surface" target="_blank" rel="noopener noreferrer">attack surface</a> for data collection.</p>

<p>Do you really need that McDonalds app when the same app is <a href="https://imgur.com/gallery/mcdonalds-app-tracks-location-info-things-like-psychological-trends-wPoauAF" target="_blank" rel="noopener noreferrer">tracking your geolocation and creating a profile of you</a>? Or the <a href="https://www.wired.com/story/tim-hortons-coffee-app-location-data-tracking/" target="_blank" rel="noopener noreferrer">Tim Hortons app that collected constant precise geolocation data</a> on their customers?</p>

<h4>4.8 Mobile Conclusion</h4>

<p>If you want to be fully anonymous you would have to forgo your mobile device entirely. However, by implementing the above steps your privacy is greatly enhanced. Remember, never let perfect be the enemy of good.</p>

<h3>5. Desktop and Laptop Recommendations</h3>

<h4>5.1 Use Linux</h4>

<p>With Microsoft announcing <a href="https://www.bbc.com/news/articles/cpwwqp6nx14o" target="_blank" rel="noopener noreferrer">literal AI spyware</a> in Windows 11 it has never been a better time to make the swap.</p>

<p>Linux has never been easier to install. Unlike proprietary counterparts, Linux distributions are free and open-source software (FOSS). See how quickly the <a href="https://arstechnica.com/security/2024/04/what-we-know-about-the-xz-utils-backdoor-that-almost-infected-the-world/" target="_blank" rel="noopener noreferrer">xz backdoor was discovered and patched</a>. Contrast this with proprietary operating systems where the <a href="https://wikileaks.org/ciav7p1/" target="_blank" rel="noopener noreferrer">CIA stockpiles zero days</a>.</p>

<p>I would recommend <a href="https://fedoraproject.org/" target="_blank" rel="noopener noreferrer">Fedora</a> or <a href="https://pop.system76.com/" target="_blank" rel="noopener noreferrer">PopOS</a>. See the <a href="https://www.privacyguides.org/en/desktop/" target="_blank" rel="noopener noreferrer">Privacy Guides section on desktop operating systems</a> for more.</p>

<h4>5.2 Use a Secure and Private Web Browser with Good Habits</h4>

<p>Use Firefox (hardened), Librewolf, Mullvad Browser or Brave. See <a href="https://www.privacyguides.org/en/desktop-browsers/" target="_blank" rel="noopener noreferrer">Privacy Guides</a>. Avoid Google Chrome like the plague.</p>

<p>Isolate and separate your different digital identities using different browser profiles. As <a href="https://fingerprint.com/" target="_blank" rel="noopener noreferrer">browser fingerprinting</a> becomes the dominant form of tracking, this habit is essential.</p>

<h4>5.3 Limit your Attack Surface</h4>

<p>Limit the applications you have installed to what you actually need.</p>

<h3>6. General Recommendations</h3>

<h4>6.1 Use a Reputable and Privacy Respecting Email Service</h4>

<p>Pick one that does not scan your messages (looking at you <a href="https://www.theguardian.com/technology/2021/may/09/how-private-is-your-gmail-and-should-you-switch" target="_blank" rel="noopener noreferrer">Google</a>). Great options:</p>

<ol>
  <li><a href="https://proton.me/mail" target="_blank" rel="noopener noreferrer">Proton Mail</a> hosted in Switzerland</li>
  <li><a href="https://tuta.com/" target="_blank" rel="noopener noreferrer">Tuta</a> hosted in Germany</li>
</ol>

<p>See the <a href="https://www.privacyguides.org/en/email/" target="_blank" rel="noopener noreferrer">Privacy Guides section on email</a> for more.</p>

<h4>6.2 Utilize Aliasing Services</h4>

<p>An email aliasing service lets you create a fresh email address for each website you sign up for. See <a href="https://www.privacyguides.org/en/email-aliasing/" target="_blank" rel="noopener noreferrer">Privacy Guides on aliasing</a>. This is perhaps one of the most important steps to regain privacy.</p>

<h4>6.3 Utilize a Reputable VPN Service</h4>

<p>A VPN routes your internet traffic through encrypted servers. Not all threat models require a VPN.</p>

<img src="/images/howvpnworks.jpg" alt="How a VPN works">

<p>When choosing a VPN provider keep in mind (see <a href="https://www.privacyguides.org/en/vpn/" target="_blank" rel="noopener noreferrer">Privacy Guides</a>):</p>

<ul>
  <li>Where is the provider based? Avoid the <a href="https://tuta.com/blog/fourteen-eyes-countries" target="_blank" rel="noopener noreferrer">14 Eyes</a> countries.</li>
  <li>Does it have an audited no logs policy?</li>
  <li>Is the code open source?</li>
  <li><strong>Stay away from free VPNs!</strong> If you are not paying you are the product!</li>
  <li>Look into <a href="https://vpnpro.com/blog/hidden-vpn-owners-unveiled-97-vpns-23-companies/" target="_blank" rel="noopener noreferrer">who is behind the VPN provider</a>.</li>
</ul>

<h4>6.4 Use End-to-end Encrypted Cloud Storage</h4>

<p>Google Drive <a href="https://www.nytimes.com/2017/09/06/technology/personaltech/security-google-cloud.html" target="_blank" rel="noopener noreferrer">scans all of your files</a>. Consider <a href="https://proton.me/drive" target="_blank" rel="noopener noreferrer">Proton Drive</a> or encrypt files with <a href="https://cryptomator.org/" target="_blank" rel="noopener noreferrer">Cryptomator</a> before uploading. See <a href="https://www.privacyguides.org/en/cloud/" target="_blank" rel="noopener noreferrer">Privacy Guides</a>.</p>

<h4>6.5 Separate Work/ Education From Your Personal Life</h4>

<p>There are many cases of <a href="https://www.wired.com/story/student-monitoring-software-privacy-in-schools/" target="_blank" rel="noopener noreferrer">schools</a>, <a href="https://www.washingtonpost.com/technology/2019/12/24/colleges-are-turning-students-phones-into-surveillance-machines-tracking-locations-hundreds-thousands/" target="_blank" rel="noopener noreferrer">colleges</a> and <a href="https://www.brookings.edu/articles/how-employers-use-technology-to-surveil-employees/" target="_blank" rel="noopener noreferrer">workplaces</a> using surveillance technology. Do not use a company/ school provided device for personal matters.</p>

<h4>6.6 Use Free Libre Open Source Software When Possible</h4>

<p>Privacy Guides has a great selection under their <a href="https://www.privacyguides.org/en/tools/" target="_blank" rel="noopener noreferrer">tools page</a>. Examples: LibreOffice, DuckDuckGo, Brave or StartPage.</p>

<h4>6.7 Use Privacy Respecting Frontends</h4>

<p>Great examples:</p>

<ul>
  <li><a href="https://freetubeapp.io/" target="_blank" rel="noopener noreferrer">FreeTube</a> or <a href="https://invidious.io/" target="_blank" rel="noopener noreferrer">Invidious</a> for YouTube on desktop</li>
  <li><a href="https://newpipe.net/" target="_blank" rel="noopener noreferrer">NewPipe</a> or <a href="https://grayjay.app/" target="_blank" rel="noopener noreferrer">GrayJay</a> on Android</li>
  <li><a href="https://github.com/yattee/yattee" target="_blank" rel="noopener noreferrer">Yattee</a> on IOS, MacOS and TvOS</li>
  <li><a href="https://github.com/pablouser1/ProxiTok/wiki/Public-instances" target="_blank" rel="noopener noreferrer">ProxiTok</a> instead of TikTok</li>
</ul>

<h3>7. Resources for Further Research</h3>

<ul>
  <li><a href="https://www.privacyguides.org/en/" target="_blank" rel="noopener noreferrer">Privacy Guides</a></li>
  <li><a href="https://ssd.eff.org/" target="_blank" rel="noopener noreferrer">Surveillance Self Defense from the EFF</a></li>
  <li><a href="https://privsec.dev/posts/" target="_blank" rel="noopener noreferrer">PrivSec.dev</a></li>
  <li><a href="https://www.youtube.com/@TheHatedOne" target="_blank" rel="noopener noreferrer">The Hated One</a></li>
  <li><a href="https://www.youtube.com/@NaomiBrockwellTV" target="_blank" rel="noopener noreferrer">NBTV</a></li>
  <li><a href="https://www.youtube.com/@MentalOutlaw" target="_blank" rel="noopener noreferrer">Mental Outlaw</a></li>
  <li><a href="https://www.youtube.com/@sideofburritos" target="_blank" rel="noopener noreferrer">Side of Burritos</a></li>
</ul>

<h3>8. A final note from me</h3>

<p>I also recommend checking out the <a href="/privacy-resources">Privacy Resources</a> page on my website!</p>

<hr>
<p class="guide-quote"><em>When people want privacy, they do not want to hide away their information from everyone; instead, they want to share it selectively and make sure that it is not used in harmful ways. Privacy is not all-or-nothing &mdash; it is about modulating boundaries and controlling data flow.</em> <strong>-The Myth of the Privacy Paradox, Daniel J. Solove</strong></p>
<hr>
