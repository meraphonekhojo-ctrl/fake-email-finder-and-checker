"""
TempMail Harvester - Provider Definitions
Contains 250+ disposable/temporary email providers.
Organized into API-based providers and domain-based providers.
"""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# API-BASED PROVIDERS (Services with REST API endpoints)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

API_PROVIDERS = [
    {
        "name": "1secmail",
        "url": "https://www.1secmail.com",
        "api_endpoint": "https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=5",
        "method": "GET",
        "parser": "json_array",
    },
    {
        "name": "GuerrillaMail",
        "url": "https://www.guerrillamail.com",
        "api_endpoint": "https://api.guerrillamail.com/ajax.php?f=get_email_address&ip=127.0.0.1",
        "method": "GET",
        "parser": "guerrilla",
    },
    {
        "name": "Mail.tm",
        "url": "https://mail.tm",
        "api_endpoint": "https://api.mail.tm/domains",
        "method": "GET",
        "parser": "mail_tm_domains",
    },
    {
        "name": "Mail.gw",
        "url": "https://mail.gw",
        "api_endpoint": "https://api.mail.gw/domains",
        "method": "GET",
        "parser": "mail_tm_domains",
    },
    {
        "name": "Tempmail.lol",
        "url": "https://tempmail.lol",
        "api_endpoint": "https://api.tempmail.lol/v2/inbox/create",
        "method": "GET",
        "parser": "tempmail_lol",
    },
    {
        "name": "Emailfake.com",
        "url": "https://emailfake.com",
        "api_endpoint": "https://emailfake.com/fake_email_generator",
        "method": "GET",
        "parser": "html_email_extract",
    },
]

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# DOMAIN-BASED PROVIDERS
# Known disposable email domains - we generate random addresses
# using these domains. Each entry = one provider.
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DISPOSABLE_DOMAINS = [
    # --- 1secmail family ---
    "1secmail.com", "1secmail.org", "1secmail.net", "bheps.com", "dcctb.com",
    "kzccv.com", "qiott.com", "wuuvo.com", "esiix.com", "wwjmp.com",
    # --- GuerrillaMail family ---
    "guerrillamail.com", "guerrillamail.net", "guerrillamail.org", "guerrillamail.de",
    "guerrillamail.info", "guerrillamail.biz", "guerrillamailblock.com", "grr.la",
    "sharklasers.com", "pokemail.net", "spam4.me",
    # --- YOPmail family ---
    "yopmail.com", "yopmail.fr", "yopmail.net", "cool.fr.nf", "jetable.fr.nf",
    "courriel.fr.nf", "moncourrier.fr.nf", "mega.zik.dj", "speed.1s.fr",
    # --- Fakemailgenerator family ---
    "armyspy.com", "cuvox.de", "dayrep.com", "einrot.com", "flddf.com",
    "gustr.com", "jourrapide.com", "rhyta.com", "superrito.com", "teleworm.us",
    # --- Internxt ---
    "inxt.me",
    # --- Trash-mail family ---
    "trash-mail.com", "rcpt.at", "damnthespam.com", "wegwerfmail.de",
    # --- Maildrop ---
    "maildrop.cc",
    # --- Mailinator family ---
    "mailinator.com", "dispostable.com",
    # --- Temp-Mail variants ---
    "tempail.com", "temp-mail.org", "temp-mail.io", "tempmailo.com",
    "tempinbox.com", "tmpmail.net", "tmpmail.org",
    # --- Specific requested sites ---
    "fake-email.pro", "tempmail.co.uk", "anonymmail.net", "tempemail.co.uk",
    "smailpro.com", "fakeemail.net", "disposablemail.com", "emailondeck.com",
    "openinbox.io", "clearout.io", "mailsac.com", "toolpix.pythonanywhere.com",
    "mails.org", "adguard.com",
    # --- Trashmail family ---
    "trashmail.com", "trashmail.me", "trashmail.net", "trashmail.org", "trashmail.at",
    "trashmail.ws", "trashmailer.com", "trashymail.com", "trashymail.net", "trashdevil.com", "trashdevil.de",
    # --- Throwaway/Generator ---
    "throwaway.email", "tempr.email", "generator.email", "fakemail.net",
    "fakeinbox.com", "crazymailing.com",
    # --- Privacy/Anon ---
    "mohmal.com", "minutemail.com", "discard.email", "mailcatch.com", "spamgourmet.com",
    "mytemp.email", "harakirimail.com", "mailnesia.com", "anonymbox.com", "mailnull.com",
    "spamhole.com", "spamfree24.org",
    # --- Incognito/Inbox ---
    "incognitomail.com", "incognitomail.net", "inboxalias.com", "inboxclean.com", "inboxclean.org",
    # --- German disposable ---
    "wegwerfmail.net", "wegwerfmail.org",
    # --- Get* family ---
    "getairmail.com", "getonemail.com", "getonemail.net", "getnada.com",
    # --- Disposable* family ---
    "devnullmail.com", "disposableaddress.com", "disposableemails.com", "disposableinbox.com", "dispose.it",
    # --- Don't/Dump family ---
    "dontreg.com", "dontsendmespam.de", "dump-email.info", "dumpandjunk.com", "dumpmail.de", "dumpyemail.com",
    # --- Email* family ---
    "emailias.com", "emailigo.de", "emailinfive.com", "emailmiser.com", "emailsensei.com",
    "emailtemporario.com.br", "emailwarden.com", "emaildienst.de", "emailgo.de", "emailproxsy.com",
    "emailto.de", "email60.com", "emailisvalid.com",
    # --- Etranquil family ---
    "etranquil.com", "etranquil.net", "etranquil.org",
    # --- Fast* car family ---
    "fastacura.com", "fastchevy.com", "fastchrysler.com", "fastkawasaki.com", "fastmazda.com",
    "fastmitsubishi.com", "fastnissan.com", "fastsubaru.com", "fastsuzuki.com", "fasttoyota.com",
    # --- F*mail family ---
    "filzmail.com", "fizmail.com",
    # --- Misc E ---
    "ephemail.net", "eyepaste.com", "explodemail.com", "emz.net", "enterto.com", "evopo.com", "easytrashmail.com",
    # --- Misc B-C ---
    "binkmail.com", "bobmail.info", "chammy.info", "boximail.com", "byom.de", "cashette.com",
    "chacuo.net", "cubiclink.com", "curryworld.de", "cust.in", "clipmail.eu", "coldemail.info",
    # --- Misc D ---
    "dacoolone.com", "daintly.com", "dandikmail.com", "deadaddress.com", "dingbone.com",
    # --- Misc G-I ---
    "great-host.in", "gsrv.co.uk", "gishpuppy.com", "haltospam.com", "hotpop.com", "ichimail.com", "imails.info",
    # --- Misc J-K ---
    "jetable.org", "dodgeit.com", "dodgit.com", "dodsi.com",
    # --- e4ward ---
    "e4ward.com",
    # --- Fake family ---
    "fakeinformation.com", "fakemail.fr", "fakemailgenerator.com",
    # --- Spam* family ---
    "spambob.com", "spambob.net", "spambob.org", "spambog.com", "spambog.de", "spambog.ru",
    "spamcannon.com", "spamcannon.net", "spamcero.com", "spamcon.org", "spamcowboy.com",
    "spamcowboy.net", "spamcowboy.org", "spamday.com", "spamex.com",
    # --- NoSpam family ---
    "nospam.ze.tc", "nobulk.com", "noclickemail.com", "nogmailspam.info", "nomail.xl.cx",
    "nomail2me.com", "nomorespamemails.com", "nostamp.com", "nospamfor.us",
    # --- Mail* extended ---
    "mailblocks.com", "mailbucket.org", "maileater.com", "mailexpire.com", "mailfreeonline.com",
    "mailimate.com", "mailin8r.com", "mailinater.com", "mailincubator.com", "mailismagic.com",
    "mailmoat.com", "mailnator.com", "mailquack.com", "mailscrap.com", "mailshell.com",
    "mailsiphon.com", "mailslite.com", "mailzilla.com", "meltmail.com",
    # --- Additional domains ---
    "sogetthis.com", "soodonims.com", "tempsky.com", "thankyou2010.com", "thisisnotmyrealemail.com",
    "throwam.com", "tittbit.in", "tmail.ws", "toiea.com", "topranklist.de", "turual.com",
    "twinmail.de", "tyldd.com", "uggsrock.com", "upliftnow.com", "uplipht.com", "venompen.com",
    "veryreallyfakeemails.com", "viditag.com", "viewcastmedia.com", "vomoto.com", "vpn.st",
    "vsimcard.com", "vubby.com", "wasteland.rfc822.org", "webemail.me", "weetransfert.com",
    "whyspam.me", "wickmail.net", "wilemail.com", "willselfdestruct.com", "winemaven.info",
    "wronghead.com", "wuzup.net", "wuzupmail.net", "wwwnew.eu", "xagloo.com", "xemaps.com",
    "xents.com", "xjoi.com", "xoxy.net", "yapped.net", "yep.it", "yogamaven.com", "yuurok.com",
    "zehnminutenmail.de", "zippymail.info", "zoaxe.com", "zoemail.org"
]

FEATURED_SERVICES = {
    "fake-email.pro": {"name": "Fake-Email.pro", "url": "https://fake-email.pro/", "known_domains": ["fake-email.pro"], "category": "Disposable", "description": "Professional disposable email service", "status": "Active"},
    "tempmail.co.uk": {"name": "TempMail UK", "url": "https://tempmail.co.uk/", "known_domains": ["tempmail.co.uk"], "category": "Temp Mail", "description": "UK based temp mail", "status": "Active"},
    "fakemailgenerator.com": {"name": "FakeMailGenerator", "url": "https://www.fakemailgenerator.com/", "known_domains": ["armyspy.com", "cuvox.de", "dayrep.com", "einrot.com", "flddf.com", "gustr.com", "jourrapide.com", "rhyta.com", "superrito.com", "teleworm.us"], "category": "Generator", "description": "Provides multiple domain options", "status": "Active"},
    "anonymmail.net": {"name": "AnonymMail", "url": "https://anonymmail.net/", "known_domains": ["anonymmail.net"], "category": "Anonymous", "description": "Anonymous disposable email", "status": "Active"},
    "temp-mail.org": {"name": "Temp-Mail", "url": "https://temp-mail.org/", "known_domains": ["temp-mail.org"], "category": "Temp Mail", "description": "One of the most popular temp mails", "status": "Active"},
    "tempemail.co.uk": {"name": "TempEmail UK", "url": "https://tempemail.co.uk/", "known_domains": ["tempemail.co.uk"], "category": "Temp Mail", "description": "Another UK temp mail variant", "status": "Active"},
    "smailpro.com": {"name": "SmailPro", "url": "https://smailpro.com/", "known_domains": ["smailpro.com"], "category": "Pro Temp Mail", "description": "Temporary email with advanced features", "status": "Active"},
    "trash-mail.com": {"name": "Trash-Mail", "url": "https://www.trash-mail.com/posteingang/", "known_domains": ["trash-mail.com", "rcpt.at", "damnthespam.com", "wegwerfmail.de"], "category": "Trash Mail", "description": "German-based trash mail", "status": "Active"},
    "fakeemail.net": {"name": "FakeEmail", "url": "https://fakeemail.net/", "known_domains": ["fakeemail.net"], "category": "Fake Mail", "description": "Instant fake email", "status": "Active"},
    "internxt.com": {"name": "Internxt Temp Mail", "url": "https://internxt.com/temporary-email", "known_domains": ["inxt.me"], "category": "Privacy", "description": "Privacy-focused temp mail", "status": "Active"},
    "maildrop.cc": {"name": "MailDrop", "url": "https://maildrop.cc/", "known_domains": ["maildrop.cc"], "category": "Open Inbox", "description": "Open source disposable email", "status": "Active"},
    "disposablemail.com": {"name": "DisposableMail", "url": "https://www.disposablemail.com/", "known_domains": ["disposablemail.com"], "category": "Disposable", "description": "Standard disposable email", "status": "Active"},
    "emailondeck.com": {"name": "EmailOnDeck", "url": "https://www.emailondeck.com/", "known_domains": ["emailondeck.com"], "category": "Temp Mail", "description": "Fast and free temp mail", "status": "Active"},
    "temp-mail.io": {"name": "Temp-Mail.io", "url": "https://temp-mail.io/en", "known_domains": ["temp-mail.io"], "category": "Temp Mail", "description": "Modern temp mail service", "status": "Active"},
    "openinbox.io": {"name": "OpenInbox", "url": "https://openinbox.io/", "known_domains": ["openinbox.io"], "category": "Open Inbox", "description": "Public disposable inbox", "status": "Active"},
    "clearout.io": {"name": "Clearout", "url": "https://clearout.io/disposable-email-checker/", "known_domains": ["clearout.io"], "category": "Checker", "description": "Email verification and disposable checking", "status": "Active"},
    "mailsac.com": {"name": "Mailsac", "url": "https://mailsac.com/", "known_domains": ["mailsac.com"], "category": "Testing API", "description": "Disposable email testing", "status": "Active"},
    "yopmail.com": {"name": "YOPmail", "url": "https://yopmail.com/en/", "known_domains": ["yopmail.com", "yopmail.fr", "yopmail.net", "cool.fr.nf", "jetable.fr.nf", "courriel.fr.nf", "moncourrier.fr.nf", "mega.zik.dj", "speed.1s.fr"], "category": "Legacy", "description": "Classic disposable email provider", "status": "Active"},
    "toolpix.pythonanywhere.com": {"name": "Toolpix Temp Mail", "url": "https://toolpix.pythonanywhere.com/temp-mail", "known_domains": ["toolpix.pythonanywhere.com"], "category": "Tool", "description": "PythonAnywhere hosted temp mail", "status": "Active"},
    "tempail.com": {"name": "Tempail", "url": "https://tempail.com/", "known_domains": ["tempail.com"], "category": "Temp Mail", "description": "1-hour temp mail", "status": "Active"},
    "tempmailo.com": {"name": "TempMailo", "url": "https://tempmailo.com/", "known_domains": ["tempmailo.com"], "category": "Temp Mail", "description": "Temp mail service", "status": "Active"},
    "mails.org": {"name": "Mails.org", "url": "https://mails.org/", "known_domains": ["mails.org"], "category": "Temp Mail", "description": "Free disposable email", "status": "Active"},
    "adguard.com": {"name": "AdGuard Temp Mail", "url": "https://adguard.com/en/adguard-temp-mail/", "known_domains": ["adguard.com"], "category": "Privacy", "description": "AdGuard's temporary email offering", "status": "Active"}
}

def get_total_provider_count():
    """Return total number of providers (API + Domain-based)."""
    return len(API_PROVIDERS) + len(DISPOSABLE_DOMAINS)
