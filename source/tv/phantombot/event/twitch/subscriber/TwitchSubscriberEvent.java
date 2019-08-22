/*
 * Copyright (C) 2016-2018 phantombot.tv
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package tv.phantombot.event.twitch.subscriber;

import tv.phantombot.event.twitch.TwitchEvent;

public class TwitchSubscriberEvent extends TwitchEvent {
    private final String subscriber;
    private final String plan;
    private final String months;

    /**
     * Class constructor.
     *
     * @param {String} subscriber
     */
    public TwitchSubscriberEvent(String subscriber) {
        this.subscriber = subscriber;
        this.plan = null;
        this.months = null;
    }

    /**
     * Class constructor.
     *
     * @param {String} subscriber
     * @param {String} plan
     */
    public TwitchSubscriberEvent(String subscriber, String plan) {
        this.subscriber = subscriber;
        this.plan = plan;
        this.months = null;
    }

    /**
     * Class constructor.
     *
     * @param {String} subscriber
     * @param {String} plan
     * @param {String} months
     */
    public TwitchSubscriberEvent(String subscriber, String plan, String months) {
        this.subscriber = subscriber;
        this.plan = plan;
        this.months = months;
    }

    /**
     * Method that returns the subscriber's name.
     *
     * @return {String} subscriber
     */
    public String getSubscriber() {
        return this.subscriber;
    }

    /**
     * Method that returns the subscription plan. (1000, 2000, 3000 and Prime)
     *
     * @return {String} plan
     */
    public String getPlan() {
        return this.plan;
    }

    /**
     * Method that returns the cumulative months.
     *
     * @return {String} months
     */
    public String getMonths() {
        return this.months;
    }
}
