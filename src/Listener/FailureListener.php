<?php

/**
 * Copyright 2015 Fabian Grutschus. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * The views and conclusions contained in the software and documentation are those
 * of the authors and should not be interpreted as representing official policies,
 * either expressed or implied, of the copyright holders.
 *
 * @author    Fabian Grutschus <f.grutschus@lubyte.de>
 * @copyright 2015 Fabian Grutschus. All rights reserved.
 * @license   BSD-2-Clause
 */

namespace Fabiang\Mink\JavaScriptErrors\Listener;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Behat\Mink\Mink;
use Behat\Behat\EventDispatcher\Event\StepTested;
use Behat\Behat\EventDispatcher\Event\AfterStepTested;
use Fabiang\Mink\JavaScriptErrors\Exception as JavaScriptException;

class FailureListener implements EventSubscriberInterface
{
    /**
     * @var Mink
     */
    private $mink;

    /**
     * @param Mink $mink
     */
    public function __construct(Mink $mink)
    {
        $this->mink = $mink;
    }

    /**
     * @return array
     */
    public static function getSubscribedEvents()
    {
        return [
            StepTested::AFTER => ['showJavaScriptErrors']
        ];
    }

    /**
     * @param AfterStepTested $event
     * @throws JavaScriptException\UnknownErrorException
     * @throws JavaScriptErrorExceptionInterface
     */
    public function showJavaScriptErrors(AfterStepTested $event)
    {
        $session = $this->mink->getSession();
        $errors  = $session->evaluateScript('ErrorHandler.get();');

        $exception = null;
        foreach ($errors as $error) {
            switch ($error['type']) {
                case 'error':
                    $exception = new JavaScriptException\JavaScriptErrorException(
                        $this->formatMessage($error),
                        0,
                        $exception
                    );
                    break;
                case 'ajaxError':
                    $exception = new JavaScriptException\AjaxErrorException(
                        $this->formatMessage($error),
                        0,
                        $exception
                    );
                    break;
                default:
                    throw new JavaScriptException\UnknownErrorTypeException(sprintf(
                        'Unknown error type received "%s"',
                        $error['type']
                    ));
                    break;
            }
        }

        $session->executeScript('ErrorHandler.clear()');

        if (null !== $exception) {
            throw $exception;
        }
    }

    /**
     * @param array $error
     * @return string
     */
    private function formatMessage(array $error)
    {
        $message = '';
        switch ($error['type']) {
            case 'error':
                $message = sprintf(
                    'JavaScript error with message "%s" at line %d and column %d in file "%s"',
                    $error['message'],
                    $error['lineno'],
                    $error['column'],
                    $error['file']
                );
                break;
            case 'ajaxError':
                $message = sprintf(
                    'Ajax error with message "%s" when trying to fetch "%s" with "%s"',
                    $error['message'],
                    $error['url'],
                    $error['method']
                );
                break;
            default;
                break;
        }
        return $message;
    }
}
