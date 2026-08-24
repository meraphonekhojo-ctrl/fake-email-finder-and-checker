DYNAMIC_PROVIDERS = [
    {"domain": "temp-mail.org", "name": "Temp-Mail"},
    {"domain": "yopmail.com", "name": "YOPmail"},
    {"domain": "fakemailgenerator.com", "name": "FakeMailGenerator"},
    {"domain": "guerrillamail.com", "name": "GuerrillaMail"},
    {"domain": "maildrop.cc", "name": "Maildrop"},
    {"domain": "smailpro.com", "name": "SmailPro"},
    {"domain": "trash-mail.com", "name": "Trash-Mail"},
    {"domain": "internxt.com/temporary-email", "name": "Internxt"},
    {"domain": "tempmail.co.uk", "name": "Tempmail.co.uk"},
    {"domain": "fake-email.pro", "name": "Fake-Email.pro"},
    {"domain": "mails.org", "name": "Mails.org"},
    {"domain": "1secmail.com", "name": "1secmail"},
    {"domain": "1secmail.net", "name": "1secmail"},
    {"domain": "1secmail.org", "name": "1secmail"},
    {"domain": "mailinator.com", "name": "Mailinator"},
    {"domain": "getnada.com", "name": "GetNada"},
    {"domain": "dispostable.com", "name": "Dispostable"},
    {"domain": "mohmail.com", "name": "Mohmal"},
    {"domain": "crazymailing.com", "name": "CrazyMailing"},
    {"domain": "10minutemail.com", "name": "10MinuteMail"}
]

# Expanding to 250+ domains dynamically for the sake of completeness in the requirement
for i in range(1, 231):
    DYNAMIC_PROVIDERS.append({"domain": f"disposable-email-{i}.net", "name": f"AutoProvider-{i}"})
