import React from 'react';

export function MailTable({ mails }) {
  return (
    <div className="mails">
      <ul>
        {mails.map((mail) => {
          if (mail.display === true || mail.display === undefined)
            return <MailItem key={mail.uid} mail={mail} />;
        })}
      </ul>
    </div>
  );
}

function MailItem({ mail }) {
  return (
    <li>
      <span className="subject">{mail.subject}</span>
      <span className="from">{mail.from.name}</span>
    </li>
  );
}
