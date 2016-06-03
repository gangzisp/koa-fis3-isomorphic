
{% for item in data %}
    <li class="rank-top-list ui-border-b {% if loop.index === 0 %}top-first{% endif %}">
        <h4>No {{ loop.index + 1 }}</h4>
        <div class="ui-avatar-one"><span style="background-image:url({{ item.logo }})"></span></div>
        <div class="desc">
            
            <h2>{{ item.name }}</h2>
            <h5><span>动态:{{ item.msg }}</span> / <span>关注:{{ item.follow }}</span></h5>
            <div class="ui-sign">昨天<span class="number">{{ item.sign }}</span>人签到</div>
        </div>
    </li>
{% endfor %}