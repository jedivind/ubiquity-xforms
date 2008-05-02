/*
 * Copyright (C) 2008 Backplane Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * Needs moving.
 */

function myList()
{
    this._list = [];
}

myList.prototype.add = function(key, obj)
{
    var found = false;

    for (var i = 0; i < this._list.length; i++)
    {
        if (this._list[i].name == key)
        {
            found = true;
            break;
        }
    }
    if (!found)
    {
        this._list.push(
            {
                name: key,
                item: obj
            }
        );
        i = this._list.length - 1;
    }
    return this._list[i].item;
};//add

myList.prototype.get = function(key)
{
    var oRet = null;
    
    for (var i = 0; i < this._list.length; i++)
    {
        if (this._list[i].name == key)
        {
            oRet = this._list[i].item;
            break;
        }
    }
    return oRet;
};//get


/*
 * This first part is essentially 'Growl core'. It should be moved into its own module at
 * some point.
 */

function GrowlRawNotification()
{
    this.displayName = null;
    this.text = null;
    this.style = null;
    this.name = null;
    this.title = null;
    this.description = null;
    this.enabled = false;
    this.iconData = null;
    this.priority = 0;
    this.reserved = 0;
    this.isSticky = false;
    this.clickContext = null;
    this.clickCallback = null;
}//GrowlRawNotification

function GrowlNotification()
{
    this.name = null;
    this.title = null;
    this.description = null;
    this.enabled = true;
    this.iconData = null;
    this.priority = 0;
    this.reserved = 0;
    this.isSticky = false;
    this.clickContext = null;
    this.clickCallback = null;
}//GrowlNotification

if (!document.Growl)
{
    document.Growl = {
        _applicationsList: new myList(),

        _displayList: [],
        _displayDefault: null,

        _notifyContainer: null,

        _notifyCount: 0,

        rawNotification: function(app, notification)
        {
            if (!this._notificationContainer)
            {
                this._notifyContainer = new YAHOO.widget.Overlay(
                    "growl_notification_container",
                    {
                        //xy: [600, 0 ],
                        context: [document.body, "tr", "tr"],
                        visible: false,
                        width: "300px"
                    }
                );

                /*
                 * Instantiate the container for the messages.
                 */

                if (this._notifyContainer)
                {
                    //this._notifyContainer.setBody("hello");
                    this._notifyContainer.render(document.body);
                    this._notifyContainer.show();
                }
                else
                    throw "Can't continue without a container for Growl messages.";
            }//if ( there is not notification container )

            var delegate = app.delegate;
            var pos = this._notifyCount++;
            var panel = new YAHOO.widget.Module(
                "growl-notification-" + pos,
                {
                    visible: false//,
                    //width: (this.element.style.width) ? this.element.style.width : "300px",
                    //height: (this.element.style.height) ? this.element.style.height : "200px"
                }
            );

            panel.setBody(
                "<div class='notification " + notification.displayName + " " + notification.priority + "' style='color: " + notification.text + "'>"
                    + "<div class='background' style='" + notification.style + "'></div>"
                    + "<div class='icon'>"
                        + ((notification.iconData) ? "<img src='" + notification.iconData + "' />" : "")
                    + "</div>"
                    + "<div class='title'>" + notification.title + "</div>"
                    + "<div class='text'>" + notification.description + "</div>"
                + "</div>"
            );
            panel.render("growl_notification_container");
            panel.show();

            if (!notification.isSticky)
            {
                setTimeout(
                    function ()
                    {
                        if (panel)
                        {
                            function destroy()
                            {
                                if (panel)
                                {
                                    panel.destroy();
                                    panel = null;
                                }
                            }

                            var anim = new YAHOO.util.Anim(
                                panel.id,
                                { opacity: { to: 0 } },
                                1,
                                YAHOO.util.Easing.easeOut
                            );
                            anim.onComplete.subscribe(destroy);
                            //panel.destroy();
                            anim.animate();
                        }
                        if (notification.clickContext && delegate.growlNotificationTimedOut)
                            delegate.growlNotificationTimedOut("id");
                    },
                    (notification.duration) ? notification.duration * 1000 : 4000
                );
            }
            panel.element.onclick = function()
            {
                if (panel)
                {
                    panel.destroy();
                    panel = null;
                }

                /*
                 * The 'per notification' callback overrides the delegate's.
                 */

                if (notification.clickCallback)
                    notification.clickCallback.call(notification.clickContext);
                else
                {
                    if (delegate.growlNotificationWasClicked)
                        delegate.growlNotificationWasClicked("id");
                }
            }//onclick handler
        },//rawNotification()

        setGrowlDelegate: function(delegate)
        {

            /*
             * Create a new notification list for each application.
             */

            var appname;

            if (!delegate.applicationNameForGrowl)
                throw "Growl delegate must implement applicationNameForGrowl()";
            else
                appname = delegate.applicationNameForGrowl();

            /*
             * It doesn't hurt to try to add it even if it's already there.
             */

            var app = this._applicationsList.add(
                appname,
                {
                    delegate: null,
                    displayName: "default",
                    _notificationsList: new myList()
                }
            );

            if (app.delegate)
                app.delegate.release();
            app.delegate = delegate;

            var nl = app._notificationsList;

            /*
             * Each notification that is being registered gets its own entry
             * in the list.
             */

            var dictionary;

            if (!delegate.registrationDictionaryForGrowl)
                throw "Growl delegate must implement registrationDictionaryForGrowl()";
            else
                dictionary = delegate.registrationDictionaryForGrowl();

            var fullList = dictionary[0];
            
            for (var i = 0; i < fullList.length; i++)
                nl.add(fullList[i], { displayName: "default", enabled: false } );

            /*
            * Now we can set the default 'enable' state of the notifications.
            */

            var enabledList = dictionary[1];

            for (i = 0; i < enabledList.length; i++)
            {
                var n = nl.get(enabledList[i]);

                //if (String(n.enabled) == "undefined")
                    n.enabled = true;
            }
            return;
        },//setGrowlDelegate()

        notify: function(notificationName, title, description, applicationName, image, sticky, priority)
        {
            /*
             * First create a notification object that will hold the format of our message.
             */

            var notification = new GrowlRawNotification();

            notification.title = title;
            notification.description = description;

            /*
             * Next get the the settings from the base style. If we have a valid
             * notification, and it has a non-default display name, then we use it,
             * otherwise we use the default for our application.
             */

            var app = this._applicationsList.get(applicationName);
            var n = app._notificationsList.get(notificationName);
            var displayName;

            if (n && n.displayName)
                displayName = n.displayName;
            if (displayName == "default")
                displayName = app.displayName;
            if (displayName == "default")
                displayName = this._displayDefault;

            var d = this._displayList[displayName];

            for (var k in d)
                notification[k] = d[k];

            /*
             * Now we override the display settings with any parameters passed.
             */

            if (image)
                notification.iconData = image;
            if (sticky)
                notification.isSticky = sticky;
            if (priority)
                notification.priority = priority;

            /*
             * Finally, we apply any changes to the settings that the user has put on.
             */

            if (n)
            {
                for (k in n)
                    notification[k] = n[k];
            }
            notification.displayName = displayName;

            /*
             * Only show the notification if it is enabled.
             */

            if (notification.enabled)
                this.rawNotification(app, notification);
            return;
        },//notify()

        addThemes: function(json)
        {
          for (var i = 0; i < json.feed.entry.length; i++)
          {
            var x = json.feed.entry[i].content.$t;
            var o;
            eval( "o = {" + json.feed.entry[i].content.$t + "}" );
            var name = o.n;
            var t = o.t;
            var b = o.b;
            var op = o.o;
            var d = o.d;
            var f = o.f;

            document.Growl._displayList[name] = {
                text: t,
                style: "background-color: " + b + "; opacity: " + op + ";",
                duration: d
            };
          }
            return;
        }
    };

    /*
     * These are the default styles.
     */

    document.Growl._displayList["plain"] = { text: "black", style: "background-color: #D0D0D0; opacity: .95; border: thin solid black", duration: 4 };
    document.Growl._displayList["smoke"] = { text: "white", style: "background-color: black; opacity: .15", duration: 10, floatingicon: false };
    document.Growl._displayDefault = "smoke";

    /*
     * Add some test configurations.
     */

    var app = document.Growl._applicationsList.add(
        "metascan",
        {
            displayName: "default",
            _notificationsList: new myList()
        }
    );
    app._notificationsList.add("Found a book", { displayName: "default" } );

    app = document.Growl._applicationsList.add(
        "somethingelse",
        {
            displayName: "default",
            _notificationsList: new myList()
        }
    );
    var nl = app._notificationsList;

    nl.add("Data saved", { displayName: "newDisplay" } );
}//if ( there is no Growl object )


if (!document.GrowlApplicationBridge)
{
    document.GrowlApplicationBridge = {
        _dictionary: [],

        notify: function(notificationName, title, description, applicationName, image, sticky, priority)
        {
            document.Growl.notify(notificationName, title, description, applicationName, image, sticky, priority);
            return;
        },//postNotification()

        register: function(applicationName, allNotifications, defaultNotifications, iconOfApplication)
        {
            this._dictionary[0] = applicationName;
            this._dictionary[1] = allNotifications;
            this._dictionary[2] = defaultNotifications;
            this._dictionary[3] = iconOfApplication;
            this.setGrowlDelegate(this);
        },//register()

        setGrowlDelegate: function(delegate)
        {
            document.Growl.setGrowlDelegate(delegate);
            return;
        },//setGrowlDelegate()

        getGrowlDelegate: function()
        {
            return this;
        },//getGrowlDelegate()

        /*
         * The following are for the delegate interface.
         */

        registrationDictionaryForGrowl: function()
        {
            return [ this._dictionary[1], this._dictionary[2] ];
        },

        applicationNameForGrowl: function()
        {
            return this._dictionary[0];
        },

        applicationIconDataForGrowl: function()
        {
            return this._dictionary[3];
        },

        release: function()
        {
            return;
        },//release()

        growlIsReady: function()
        {
            return;
        },

        growlNotificationWasClicked: function(id)
        {
            return;
        },

        growlNotificationTimedOut: function(id)
        {
            return;
        }
    };
}//if ( there is no document.GrowlApplicationBridge )
