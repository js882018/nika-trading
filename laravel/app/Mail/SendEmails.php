<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SendEmails extends Mailable {

    use Queueable,
        SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public $mail_data;

    public function __construct($data) {
        $this->mail_data = $data;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build() {
        $result = $this->subject($this->mail_data['subject'])
                ->view($this->mail_data['blade_name']);
        if (array_key_exists('attachment', $this->mail_data)) {
            $result->attach($this->mail_data['attachment']);
        }
        return $result;
    }

}
